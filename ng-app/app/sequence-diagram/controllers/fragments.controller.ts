import { Injectable, ApplicationRef } from '@angular/core';
import { FragmentPulleyComponent } from '../components/fragment-pulley.component';
import { CombinedFragment } from '../models/CombinedFragment';
import { InteractionOperand } from '../models/InteractionOperand';
import { SequenceDiagramService } from '../services/sequence.diagram.service';
import { InputService } from '../services/input.service';
import { Datastore } from '../../datastore';
import { MenuComponent } from '../../menu/components/menu.component';
import { DialogService } from '../../dialog/services';
import { JobsService } from '../services';
import { SequenceDiagramComponent } from '../components/sequence-diagram.component';
import { SequenceDiagramController } from './sequence-diagram.controller';
import { ConfigService } from '../../config';
import { Headers, Http, RequestOptions } from '@angular/http';
import { LayerComponent } from '../components/layer.component';
import * as M from '../../sequence-diagram/models';

@Injectable()
export class FragmentsController {

  /* Sequence Diagram Component Instance */
  public sequenceDiagramComponent: SequenceDiagramComponent = null;

  /* Sequence Diagram Controller Instance */
  public sequenceDiagramController: SequenceDiagramController = null;

  /* Menu Component Instance */
  public menuComponent: MenuComponent = null;

  constructor(
    protected dialogService: DialogService,
    protected jobsService: JobsService,
    protected inputService: InputService,
    protected datastore: Datastore,
    protected http: Http,
    protected config: ConfigService,
    protected appRef: ApplicationRef
  ) {
    // Initialize operations
    this.deformFragment();
    this.moveFragment();
    this.createFragment();
    this.layerize();
    this.addOperand();
    this.editFragmentText();
  }

  public registerMenuListeners() {
    this.menuComponent.onModeChange.subscribe((editMode) => {
      if (editMode) {
        this.sequenceDiagramComponent.refresh();
      }
    });
  }

  protected draggedPulley: FragmentPulleyComponent = null;
  protected draggedOperand = null;
  protected affectedPreviousOperand = null;
  protected affectedNextOperand = null;
  protected affectedCombinedFragment = null;
  protected pullDelta = 0;
  protected pullDeltaEffected = 0;
  protected pullDeltaMin = 0;
  protected pullDeltaMax = 0;
  protected draggedOpIndex = -1;
  protected prevOpIndex = -1;
  protected nextOpIndex = -1;
  protected VYSKA_ZUBKU = 40;

  protected deformFragment() {
    this.dragInitialization();
    this.dragOngoing();
    this.dragFinish();
  }

  protected moveFragment() {
    this.moveInitialization();
    this.moveOngoing();
    this.moveFinish();
  }

  protected addOperand() {
    this.addOperandOnFragmentPulley();
  }

  protected createFragment() {
    this.createFragmentOnLifelinePoint();
  }

  protected dragInitialization() {
    this.inputService.onMouseDown((event) => {

      if (event.model.type == 'FragmentPulley' && this.menuComponent.editMode && this.menuComponent.addingMessages) {
        // initialize dragged variables
        this.draggedPulley = event.model.component;
        this.draggedOperand = this.draggedPulley.fragment;
        this.affectedCombinedFragment = this.draggedOperand.interactionFragmentModel.parent.componentObject;

        // get fragment index in parent's children array for comparisons
        this.draggedOpIndex = this.draggedOperand.interactionFragmentModel.parent.children.indexOf(this.draggedOperand.interactionFragmentModel);

        // next and previous operand may or may not be there
        if (this.draggedPulley.isTop) {

          // if we are dragging on the top pulley, the operand below this one (if any) will not be affected - check the operand above  
          if (this.draggedOpIndex != 0) {
            this.prevOpIndex = this.draggedOpIndex - 1;
            this.affectedPreviousOperand = this.draggedOperand.interactionFragmentModel.parent.children[this.prevOpIndex].componentObject;
          }

          // set delta extremes to constrain pulling

          // set minimum delta to the parent's top to avoid pulling it above its' parent's parent's top border
          this.pullDeltaMin = -this.affectedCombinedFragment.top;
          // add heights of preceding siblings
          for (let sibling of this.affectedCombinedFragment.interactionFragmentModel.children) {
            // stop when you reach the dragged operand
            if (sibling.componentObject == this.draggedOperand) {
              break;
            }
            this.pullDeltaMin -= sibling.componentObject.height;
          }
          

          // set maximum delta to this fragment's height to avoid making its' height negative
          this.pullDeltaMax = this.draggedOperand.height;

        } else if (this.draggedPulley.isBottom) {

          // if we are dragging on the bottom pulley, the operand above this one (if any) will not be affected - check the operand below
          if (this.draggedOpIndex != this.draggedOperand.interactionFragmentModel.parent.children.length - 1) {
            this.nextOpIndex = this.draggedOpIndex + 1;
            this.affectedNextOperand = this.draggedOperand.interactionFragmentModel.parent.children[this.nextOpIndex].componentObject;
          }

          // set delta extremes to constrain pulling

          // set minimum delta to this fragment's height to avoid making its height negative
          this.pullDeltaMin = -this.draggedOperand.height;

          // set maximum delta to the distance between the bottom end of this operand and the bottom of the fragment that encloses this operand's parent combined fragment
          let height_above = this.affectedCombinedFragment.top;
          for (let child_operand of this.draggedOperand.interactionFragmentModel.parent.children) {
            height_above += child_operand.componentObject.height;
            if (child_operand.componentObject == this.draggedOperand) {
              break;
            }
          }

          // if the enclosing fragment does not define a componentObject property, it is a layer and its height is fixed
          let enclosing_fragment = this.affectedCombinedFragment.interactionFragmentModel.parent.parent.componentObject;
          if (enclosing_fragment) {
            this.pullDeltaMax = enclosing_fragment.height - height_above;
          } else {
            this.pullDeltaMax = 848 - height_above;
          }
        }

      }

    });
  }

  protected dragOngoing() {
    this.inputService.onMouseMove((event) => {

      if (this.draggedPulley && this.menuComponent.editMode && this.menuComponent.addingMessages) {
        // get the delta of fragment pulling
        let deltaY = event.movementY/2;

        // clamp the effective delta to constraints
        let effectiveDeltaY = Math.min(Math.max(deltaY, this.pullDeltaMin - this.pullDeltaEffected), this.pullDeltaMax - this.pullDeltaEffected);

        // change mouse delta
        this.pullDelta += deltaY;

        // change effected delta
        this.pullDeltaEffected += effectiveDeltaY;

        // behaviour changes depending on whether it is the top or bottom pulley
        if (this.draggedPulley.isTop) {
          // top pulley

          // change operand height
          this.draggedOperand.height -= effectiveDeltaY;

          // apply to children - position of children is relative to position of top border of this operand and we want them to stay where they are so we compensate for its change
          for (let child_interaction of this.draggedOperand.interactionFragmentModel.children) {
            for (let child_combined_frag of child_interaction.children) {
              child_combined_frag.componentObject.top -= effectiveDeltaY;
            }
          }

          let appliedDeltaY = 0;

          while (appliedDeltaY != effectiveDeltaY) {
            // apply to previous operand
            if (this.affectedPreviousOperand) {

              // if the previous operand's height underflows, fix underflow and apply it to preceding operand
              this.affectedPreviousOperand.height += effectiveDeltaY - appliedDeltaY;

              if (this.affectedPreviousOperand.height < 0) {
                appliedDeltaY += effectiveDeltaY - this.affectedPreviousOperand.height;
                this.affectedPreviousOperand.height = 0;

                // get the preceding operand
                if (this.prevOpIndex != 0) {
                  this.prevOpIndex--;
                  this.affectedPreviousOperand = this.affectedPreviousOperand.interactionFragmentModel.parent.children[this.prevOpIndex].componentObject;
                } else {
                  this.affectedPreviousOperand = null;
                  this.prevOpIndex = -1;
                }
              } else if (this.affectedPreviousOperand.height > this.affectedPreviousOperand.original_height) {// if it overflows, check for 0-height operand

                // if 0-height operand is present, restore it
                if (Math.abs(this.prevOpIndex - this.draggedOpIndex) != 1) {
                  appliedDeltaY += this.affectedPreviousOperand.height - this.affectedPreviousOperand.original_height;
                  this.affectedPreviousOperand.height = this.affectedPreviousOperand.original_height;
                  this.prevOpIndex++;
                  this.affectedPreviousOperand = this.affectedPreviousOperand.interactionFragmentModel.parent.children[this.prevOpIndex].componentObject;
                } else {
                  appliedDeltaY = effectiveDeltaY;
                }
              } else {
                appliedDeltaY = effectiveDeltaY;
              }
              
            } else { // if there is no previous operand, affect the parent combined fragment
              this.affectedCombinedFragment.top += effectiveDeltaY - appliedDeltaY;
              
              // detect parent overflow
              if (this.affectedCombinedFragment.top > this.affectedCombinedFragment.original_top && this.draggedOpIndex != 0) {
                appliedDeltaY += effectiveDeltaY - appliedDeltaY - (this.affectedCombinedFragment.top - this.affectedCombinedFragment.original_top);
                this.affectedCombinedFragment.top = this.affectedCombinedFragment.original_top;

                // get the shrunk operand
                this.prevOpIndex = 0;
                this.affectedPreviousOperand = this.draggedOperand.interactionFragmentModel.parent.children[this.prevOpIndex].componentObject;
              } else {
                appliedDeltaY = effectiveDeltaY;
              }
            }
          }   

        } else if (this.draggedPulley.isBottom) {
          // bottom pulley

          // change operand height
          this.draggedOperand.height += effectiveDeltaY;

          let appliedDeltaY = 0;

          while (appliedDeltaY != effectiveDeltaY) {
            // apply to next operand

            let loop_affectedNext = this.affectedNextOperand;
            let loop_prev_delta = appliedDeltaY;

            if (this.affectedNextOperand) {

              // if the next operand's height underflows, fix underflow and apply it to following operand
              this.affectedNextOperand.height -= effectiveDeltaY - appliedDeltaY;

              if (this.affectedNextOperand.height < 0) {
                appliedDeltaY += -(effectiveDeltaY - this.affectedNextOperand.height);
                this.affectedNextOperand.height = 0;

                // get the following operand
                if (this.nextOpIndex != this.affectedCombinedFragment.interactionFragmentModel.children.length - 1) {
                  this.nextOpIndex++;
                  this.affectedNextOperand = this.affectedNextOperand.interactionFragmentModel.parent.children[this.nextOpIndex].componentObject;
                } else {
                  this.affectedNextOperand = null;
                  this.nextOpIndex = -1;
                }
              } else if (this.affectedNextOperand.height > this.affectedNextOperand.original_height) {// if it overflows, check for 0-height operand

                // if 0-height operand is present, restore it
                if (Math.abs(this.nextOpIndex - this.draggedOpIndex) != 1) {
                  appliedDeltaY += -(this.affectedNextOperand.height - this.affectedNextOperand.original_height);
                  this.affectedNextOperand.height = this.affectedNextOperand.original_height;
                  this.nextOpIndex--;
                  this.affectedNextOperand = this.affectedNextOperand.interactionFragmentModel.parent.children[this.nextOpIndex].componentObject;
                } else {
                  appliedDeltaY = effectiveDeltaY;
                }
              } else {
                appliedDeltaY = effectiveDeltaY;
              }

              // apply to next operand
              if (loop_affectedNext) {
                // apply to children of next element
                for (let child_interaction of loop_affectedNext.interactionFragmentModel.children) {
                  for (let child_combined_frag of child_interaction.children) {
                    child_combined_frag.componentObject.top -= effectiveDeltaY - loop_prev_delta;
                  }
                }
              }
              
            } else { // if there is no previous operand, affect the parent combined fragment
              
              // detect parent underflow
              if (this.affectedCombinedFragment.height() < this.affectedCombinedFragment.original_height()
                && this.draggedOpIndex != this.affectedCombinedFragment.interactionFragmentModel.children.length - 1) {

                appliedDeltaY += -(effectiveDeltaY - appliedDeltaY - (this.affectedCombinedFragment.height() - this.affectedCombinedFragment.original_height()));

                // get the shrunk operand
                this.nextOpIndex = this.affectedCombinedFragment.interactionFragmentModel.children.length - 1;
                this.affectedNextOperand = this.draggedOperand.interactionFragmentModel.parent.children[this.nextOpIndex].componentObject;
              } else {
                appliedDeltaY = effectiveDeltaY;
              }
            }
          }   
        }

      }

    });
  }

  protected dragFinish() {
    this.inputService.onMouseUp((event) => {

      if (this.draggedPulley && this.menuComponent.editMode) {

        let editedMessages = [];
        let editedFragments = [];

        // change message ownership

        // case when the dragged operand was made smaller
        if (this.draggedOperand.height < this.draggedOperand.original_height) {

          let newMinEnvelope;
          let newMaxEnvelope;
          let targetInteraction;
          
          // set calculation bounds and interaction to move messages to
          if (this.draggedPulley.isTop) {
            newMinEnvelope = this.draggedOperand.envelope.max
            - (this.draggedOperand.envelope.max - this.draggedOperand.envelope.min) * (this.draggedOperand.height / this.draggedOperand.original_height);
            newMaxEnvelope = this.draggedOperand.envelope.max;
            
            if (this.affectedPreviousOperand) {
              targetInteraction = this.affectedPreviousOperand.interactionFragmentModel.children[0].fragmentable;
            } else {
              targetInteraction = this.affectedCombinedFragment.interactionFragmentModel.parent.fragmentable;
            }
             
          } else if (this.draggedPulley.isBottom) {
            newMinEnvelope = this.draggedOperand.envelope.min;
            newMaxEnvelope = this.draggedOperand.envelope.min
            + (this.draggedOperand.envelope.max - this.draggedOperand.envelope.min) * (this.draggedOperand.height / this.draggedOperand.original_height); 

            if (this.affectedNextOperand) {
              targetInteraction = this.affectedNextOperand.interactionFragmentModel.children[0].fragmentable;
            } else {
              targetInteraction = this.affectedCombinedFragment.interactionFragmentModel.parent.fragmentable;
            }
          }

          // move messages
          for (let message of this.draggedOperand.interactionFragmentModel.recursiveMessagesOneLevel) {
            if (message.sendEvent.time < newMinEnvelope || message.sendEvent.time > newMaxEnvelope && editedMessages.indexOf(message) === -1) {
              message.interaction = targetInteraction;
              if (this.draggedPulley.isTop) {
                message.sendEvent.time--;
                message.receiveEvent.time--;
              } else if (this.draggedPulley.isBottom) {
                message.sendEvent.time++;
                message.receiveEvent.time++;
              }
              editedMessages.push(message);
            }
          }

          // move fragments - only when they are completely removed from their owner
          for (let fragment of this.draggedOperand.interactionFragmentModel.children[0].children) {

            if (fragment.componentObject.envelope.min > newMaxEnvelope || fragment.componentObject.envelope.max < newMinEnvelope) {
              editedFragments.push(fragment);
              fragment.parent = targetInteraction.fragment;
              for (let message of fragment.recursiveMessages) {
                if (this.draggedPulley.isTop) {
                  message.sendEvent.time--;
                  message.receiveEvent.time--;
                } else if (this.draggedPulley.isBottom) {
                  message.sendEvent.time++;
                  message.receiveEvent.time++;
                }
              }
            }
            
          }

        } else if (this.draggedOperand.height > this.draggedOperand.original_height) {// case when the dragged operand was made bigger

          let targetInteraction = this.draggedOperand.interactionFragmentModel.children[0].fragmentable;

          if (this.draggedPulley.isTop) {
            let height_delta_sum = 0;

            let envelopeMin;
            let envelopeMax;

            for (let i = this.draggedOpIndex - 1; i >= 0; i--) {
              let current_operand = this.affectedCombinedFragment.interactionFragmentModel.children[i].componentObject;

              if (current_operand.height >= current_operand.original_height) {
                break;
              }

              height_delta_sum += current_operand.height - current_operand.original_height;

              let envelopeMin = current_operand.envelope.min;
              let envelopeMax = current_operand.envelope.min + ((current_operand.envelope.max - current_operand.envelope.min)
              * (current_operand.height / current_operand.original_height));

              for (let message of current_operand.interactionFragmentModel.recursiveMessagesOneLevel) {
                if (message.sendEvent.time < envelopeMin || message.sendEvent.time > envelopeMax && editedMessages.indexOf(message) === -1) {
                  message.interaction = targetInteraction;
                  editedMessages.push(message);
                  message.sendEvent.time++;
                  message.receiveEvent.time++;
                }
              }

              // move fragments - only when they are completely removed from their owner
              for (let fragment of current_operand.interactionFragmentModel.children[0].children) {

                if (fragment.componentObject.envelope.min > envelopeMax || fragment.componentObject.envelope.max < envelopeMin) {
                  editedFragments.push(fragment);
                  fragment.parent = targetInteraction.fragment;
                  for (let message of fragment.recursiveMessages) {
                    message.sendEvent.time++;
                    message.receiveEvent.time++;
                  }
                }
                
              }
            }

            if (Math.abs(height_delta_sum) < this.draggedOperand.height - this.draggedOperand.original_height) {
              // move messages from the enclosing fragment

              let envelope_min = this.draggedOperand.envelope.max - (this.draggedOperand.envelope.max - this.draggedOperand.envelope.min) * 
              (this.draggedOperand.height / this.draggedOperand.original_height);
              let envelope_max = this.affectedCombinedFragment.envelope.min;

              /*for (let message of this.affectedCombinedFragment.interactionFragmentModel.parent.recursiveMessagesOneLevel) {
                if (((message.sendEvent.covered.order >= this.draggedOperand.leftmost_lifeline.order && message.sendEvent.covered.order <= this.draggedOperand.rightmost_lifeline.order)
                  || (message.receiveEvent.covered.order >= this.draggedOperand.leftmost_lifeline.order && message.receiveEvent.covered.order <= this.draggedOperand.rightmost_lifeline.order))
                  && message.sendEvent.time > envelope_min && message.sendEvent.time < envelope_max && editedMessages.indexOf(message) === -1) {
                  message.interaction = targetInteraction;
                  message.sendEvent.time++;
                  message.receiveEvent.time++;
                  editedMessages.push(message);
                }
              }

              // move fragments - only when they are completely removed from their owner
              for (let fragment of this.affectedCombinedFragment.interactionFragmentModel.parent.children) {

                if (fragment.componentObject.envelope.min < envelope_max && fragment.componentObject.envelope.max > envelope_min) {
                  editedFragments.push(fragment);
                  fragment.parent = targetInteraction.fragment;
                  for (let message of fragment.recursiveMessages) {
                    message.sendEvent.time++;
                    message.receiveEvent.time++;
                  }
                }
                
              }*/

              let expandedStuff = this.cyclicalCollisionDetection([this.draggedOperand.leftmost_lifeline, this.draggedOperand.rightmost_lifeline],
                                                                  [envelope_min, envelope_max], this.affectedCombinedFragment.interactionFragmentModel.parent.fragmentable);

              for (let message of expandedStuff[0]) {
                message.interaction = targetInteraction;
                message.sendEvent.time++;
                message.receiveEvent.time++;
                editedMessages.push(message);
              }

              for (let fragment of expandedStuff[1]) {

                if (this.affectedCombinedFragment.interactionFragmentModel == fragment) {
                  continue;
                }

                editedFragments.push(fragment);
                fragment.parent = targetInteraction.fragment;
                for (let message of fragment.recursiveMessages) {
                  message.sendEvent.time++;
                  message.receiveEvent.time++;
                }
              }
            }

          } else if (this.draggedPulley.isBottom) {
            let height_delta_sum = 0;

            let envelopeMin;
            let envelopeMax;

            for (let i = this.draggedOpIndex + 1; i <= this.affectedCombinedFragment.interactionFragmentModel.children.length - 1; i++) {
              let current_operand = this.affectedCombinedFragment.interactionFragmentModel.children[i].componentObject;

              if (current_operand.height >= current_operand.original_height) {
                break;
              }

              height_delta_sum += current_operand.height - current_operand.original_height;

              let envelopeMin = current_operand.envelope.max - (current_operand.envelope.max - current_operand.envelope.min)
              * (current_operand.height / current_operand.original_height);
              let envelopeMax = current_operand.envelope.max;


              for (let message of current_operand.interactionFragmentModel.recursiveMessagesOneLevel) {
                if (message.sendEvent.time < envelopeMin || message.sendEvent.time > envelopeMax && editedMessages.indexOf(message) === -1) {
                  message.interaction = targetInteraction;
                  editedMessages.push(message);
                  message.sendEvent.time--;
                  message.receiveEvent.time--;
                }
              }

              // move fragments - only when they are completely removed from their owner
              for (let fragment of current_operand.interactionFragmentModel.children[0].children) {

                if (fragment.componentObject.envelope.min > envelopeMax || fragment.componentObject.envelope.max < envelopeMin) {
                  editedFragments.push(fragment);
                  fragment.parent = targetInteraction.fragment;
                  for (let message of fragment.recursiveMessages) {
                    message.sendEvent.time--;
                    message.receiveEvent.time--;
                  }
                }
                
              }

            }

            if (Math.abs(height_delta_sum) < this.draggedOperand.height - this.draggedOperand.original_height) {
              // move messages from the enclosing fragment

              let envelope_min = this.affectedCombinedFragment.envelope.max
              let envelope_max = this.draggedOperand.envelope.min + (this.draggedOperand.envelope.max - this.draggedOperand.envelope.min) * 
              (this.draggedOperand.height / this.draggedOperand.original_height);

              // for (let message of this.affectedCombinedFragment.interactionFragmentModel.parent.recursiveMessagesOneLevel) {
              //   if (((message.sendEvent.covered.order >= this.draggedOperand.leftmost_lifeline.order && message.sendEvent.covered.order <= this.draggedOperand.rightmost_lifeline.order)
              //     || (message.receiveEvent.covered.order >= this.draggedOperand.leftmost_lifeline.order && message.receiveEvent.covered.order <= this.draggedOperand.rightmost_lifeline.order))
              //     && message.sendEvent.time > envelope_min && message.sendEvent.time < envelope_max && editedMessages.indexOf(message) === -1) {
              //     message.interaction = targetInteraction;
              //     message.sendEvent.time--;
              //     message.receiveEvent.time--;
              //     editedMessages.push(message);
              //   }
              // }

              // // move fragments - only when they are completely removed from their owner
              // for (let fragment of this.affectedCombinedFragment.interactionFragmentModel.parent.children) {

              //   if (fragment.componentObject.envelope.min < envelope_max && fragment.componentObject.envelope.max > envelope_min) {
              //     editedFragments.push(fragment);
              //     fragment.parent = targetInteraction.fragment;
              //     for (let message of fragment.recursiveMessages) {
              //       message.sendEvent.time--;
              //       message.receiveEvent.time--;
              //     }
              //   }
                
              // }

              let expandedStuff = this.cyclicalCollisionDetection([this.draggedOperand.leftmost_lifeline, this.draggedOperand.rightmost_lifeline],
                                                                  [envelope_min, envelope_max], this.affectedCombinedFragment.interactionFragmentModel.parent.fragmentable);

              for (let message of expandedStuff[0]) {
                message.interaction = targetInteraction;
                message.sendEvent.time--;
                message.receiveEvent.time--;
                editedMessages.push(message);
              }

              for (let fragment of expandedStuff[1]) {

                if (this.affectedCombinedFragment.interactionFragmentModel == fragment) {
                  continue;
                }

                editedFragments.push(fragment);
                fragment.parent = targetInteraction.fragment;
                for (let message of fragment.recursiveMessages) {
                  message.sendEvent.time--;
                  message.receiveEvent.time--;
                }
              }

              // if (this.draggedOperand.leftmost_lifeline != expandedStuff[2][0] || this.draggedOperand.rightmost_lifeline != expandedStuff[2][1]) {
              //   for (let rechecked_fragment of this.affectedCombinedFragment.interactionFragmntModel.children) {
              //     if (rechecked_fragment.componentObject.height == 0 || rechecked_fragment == this.draggedOperand.interactionFragmentModel) {
              //       continue;
              //     }

              //     let recheck_expand = this.cyclicalCollisionDetection(expandedStuff[2],
              //                                                         [rechecked_fragment.componentObject.envelope.min, rechecked_fragment.componentObject.envelope.max],
              //                                                         this.affectedCombinedFragment.interactionFragmentModel.parent.fragmentable);

              //     for (let message of recheck_expand[0]) {
              //       if (message.interaction == this.affectedCombinedFragment.interactionFragmentModel.parent.fragmentable) {
              //         message.interaction = rechecked_fragment.children[0].fragmentable;
              //         editedMessages.push(message);
              //       }
              //     }

              //     for (let fragment of recheck_expand[1]) {

              //     }
              //   }
              // }
            }
          }

        }

        // Start job
        this.jobsService.start('deformFragment.fragment.' + this.draggedOperand.id);

        let dragOp = this.draggedOperand;

        let saves_pending = 0;

        let occurences = [];

        let observables = [];

        for (let fragment of editedFragments) {


          // update enclosed messages recursively
          for (let message of fragment.recursiveMessages) {
            occurences.push(message.sendEvent);
            occurences.push(message.receiveEvent);
          }


          // send update JSON manually because the library used does not support relationship updates

          saves_pending++;

          let headers = new Headers({
            'Content-Type': 'application/vnd.api+json',
            'Accept': 'application/vnd.api+json'
          });

          let options = new RequestOptions({ headers: headers });
          let url = "/api/v1/interaction-fragments/" + fragment.id;

          observables.push(this.http.patch(url, {
            "data": {
              "type": "interaction-fragments",
              "id": fragment.id.toString(),
              "relationships": {
                "parent": {
                  "data": {
                    "type": "interaction-fragments",
                    "id": fragment.parent.id.toString()
                  }
                }
              }
            }
          }, options));
        }

        for (let message of editedMessages) {

          occurences.push(message.sendEvent);
          occurences.push(message.receiveEvent);

          // send update JSON manually because the library used does not support relationship updates

          saves_pending++;

          let headers = new Headers({
            'Content-Type': 'application/vnd.api+json',
            'Accept': 'application/vnd.api+json'
          });

          let options = new RequestOptions({ headers: headers });
          let url = "/api/v1/messages/" + message.id;

          observables.push(this.http.patch(url, {
            "data": {
              "type": "messages",
              "id": message.id.toString(),
              "relationships": {
                "interaction": {
                  "data": {
                    "type": "interactions",
                    "id": message.interaction.id.toString()
                  }
                }
              }
            }
          }, options));

        }

        for (let occurrence of occurences) {

          saves_pending += 1;

          let headers = new Headers({
            'Content-Type': 'application/vnd.api+json',
            'Accept': 'application/vnd.api+json'
          });

          let options = new RequestOptions({ headers: headers });
          let url = "/api/v1/occurrence-specifications/" + occurrence.id;

          observables.push(this.http.patch(url, {
            "data": {
              "type": "occurrence-specifications",
              "id": occurrence.id.toString(),
              "attributes": {
                "time": occurrence.time.toString(),
              }
            }
          }, options));

        }

        let deletes = this.deleteEmptyFragments(this.affectedCombinedFragment);
        saves_pending += deletes.length;
        observables = observables.concat(deletes);

        if (observables.length == 0) {
          // Finish job
          this.sequenceDiagramComponent.refresh(() => {
              this.jobsService.finish('deformFragment.fragment.' + dragOp.id);
          });
        } else {

          let save_listen = () => {
            saves_pending--;
            if (saves_pending == 0) {
              this.sequenceDiagramComponent.refresh(() => {
                this.jobsService.finish('deformFragment.fragment.' + dragOp.id);
              });
            }
          };

          for (let observable of observables) {
            observable.subscribe(save_listen);
          }

        }

        this.draggedPulley = null;
        this.draggedOperand = null;
        this.affectedPreviousOperand = null;
        this.affectedNextOperand = null;
        this.affectedCombinedFragment = null;
        this.pullDelta = 0;
        this.pullDeltaEffected = 0;
        this.pullDeltaMin = 0;
        this.pullDeltaMax = 0;
        this.draggedOpIndex = -1;
        this.prevOpIndex = -1;
        this.nextOpIndex = -1;

      }
    });
  }

  protected movedOperand = null;
  protected movedOperandIndex = -1;
  protected parentCombinedFragment = null;
  protected moveDelta = 0;
  protected originalIndex = -1;

  protected moveInitialization() {

    this.inputService.onMouseDown((event) => {
      if (event.model.type == "InteractionConstraint" && this.menuComponent.editMode) {

        this.movedOperand = event.model.component;
        this.parentCombinedFragment = this.movedOperand.interactionFragmentModel.parent.componentObject;
        this.movedOperandIndex = this.parentCombinedFragment.interactionFragmentModel.children.indexOf(this.movedOperand.interactionFragmentModel);
        this.nextOpIndex = this.movedOperandIndex + 1;
        this.prevOpIndex = this.movedOperandIndex - 1;
        this.moveDelta = 0;
        this.originalIndex = this.movedOperandIndex;

      }
    });

  }

  protected moveOngoing() {
    this.inputService.onMouseMove((event) => {
      if (this.movedOperand && this.menuComponent.editMode) {

        let delta = event.movementY/2;
        this.moveDelta += delta;

        let deltaEnvelope = (this.movedOperand.envelope.min + this.movedOperand.envelope.max)/2 + this.moveDelta/this.VYSKA_ZUBKU;

        if (this.moveDelta > 0) {
          // check fragment move downward
          while (this.parentCombinedFragment.interactionFragmentModel.children.length > this.nextOpIndex
                && this.parentCombinedFragment.interactionFragmentModel.children[this.nextOpIndex].componentObject.envelope.max < deltaEnvelope) {

            let next_operand = this.parentCombinedFragment.interactionFragmentModel.children[this.nextOpIndex].componentObject;

            this.moveDelta -= (next_operand.envelope.max - next_operand.envelope.min) * this.VYSKA_ZUBKU;

            next_operand.envelope.min -= this.movedOperand.envelope.max - this.movedOperand.envelope.min;
            next_operand.envelope.max -= this.movedOperand.envelope.max - this.movedOperand.envelope.min;

            for (let message of next_operand.interactionFragmentModel.recursiveMessages) {
              message.sendEvent.time -= this.movedOperand.envelope.max - this.movedOperand.envelope.min;
              message.receiveEvent.time -= this.movedOperand.envelope.max - this.movedOperand.envelope.min;
            }

            this.movedOperand.envelope.min += next_operand.envelope.max - next_operand.envelope.min;
            this.movedOperand.envelope.max += next_operand.envelope.max - next_operand.envelope.min;

            for (let message of this.movedOperand.interactionFragmentModel.recursiveMessages) {
              message.sendEvent.time += next_operand.envelope.max - next_operand.envelope.min;
              message.receiveEvent.time += next_operand.envelope.max - next_operand.envelope.min;
            }

            this.parentCombinedFragment.interactionFragmentModel.children[this.movedOperandIndex] = next_operand.interactionFragmentModel;
            this.parentCombinedFragment.interactionFragmentModel.children[this.nextOpIndex] = this.movedOperand.interactionFragmentModel;

            this.nextOpIndex++;
            this.movedOperandIndex++;
            this.prevOpIndex++;

            console.log(deltaEnvelope);
            deltaEnvelope = (this.movedOperand.envelope.min + this.movedOperand.envelope.max)/2 + this.moveDelta/this.VYSKA_ZUBKU;
            console.log(deltaEnvelope);

            let current_fragment = this.movedOperand.interactionFragmentModel;

            while (!(current_fragment.componentObject.nativeComponent instanceof LayerComponent)) {
              current_fragment = current_fragment.parent;
            }

            current_fragment.componentObject.nativeComponent.ngOnChanges();

          }
        } else {
          // check fragment move upward
          while (0 <= this.prevOpIndex
                && this.parentCombinedFragment.interactionFragmentModel.children[this.prevOpIndex].componentObject.envelope.min > deltaEnvelope) {

            let prev_operand = this.parentCombinedFragment.interactionFragmentModel.children[this.prevOpIndex].componentObject;

            this.moveDelta += (prev_operand.envelope.max - prev_operand.envelope.min) * this.VYSKA_ZUBKU;

            prev_operand.envelope.min += this.movedOperand.envelope.max - this.movedOperand.envelope.min;
            prev_operand.envelope.max += this.movedOperand.envelope.max - this.movedOperand.envelope.min;

            for (let message of prev_operand.interactionFragmentModel.recursiveMessages) {
              message.sendEvent.time += this.movedOperand.envelope.max - this.movedOperand.envelope.min;
              message.receiveEvent.time += this.movedOperand.envelope.max - this.movedOperand.envelope.min;
            }

            this.movedOperand.envelope.min -= prev_operand.envelope.max - prev_operand.envelope.min;
            this.movedOperand.envelope.max -= prev_operand.envelope.max - prev_operand.envelope.min;

            for (let message of this.movedOperand.interactionFragmentModel.recursiveMessages) {
              message.sendEvent.time -= prev_operand.envelope.max - prev_operand.envelope.min;
              message.receiveEvent.time -= prev_operand.envelope.max - prev_operand.envelope.min;
            }

            this.parentCombinedFragment.interactionFragmentModel.children[this.movedOperandIndex] = prev_operand.interactionFragmentModel;
            this.parentCombinedFragment.interactionFragmentModel.children[this.prevOpIndex] = this.movedOperand.interactionFragmentModel;

            this.prevOpIndex--;
            this.movedOperandIndex--;
            this.nextOpIndex--;

            console.log(deltaEnvelope);
            deltaEnvelope = (this.movedOperand.envelope.min + this.movedOperand.envelope.max)/2 + this.moveDelta/this.VYSKA_ZUBKU;
            console.log(deltaEnvelope);

            let current_fragment = this.movedOperand.interactionFragmentModel;

            while (!(current_fragment.componentObject.nativeComponent instanceof LayerComponent)) {
              current_fragment = current_fragment.parent;
            }

            current_fragment.componentObject.nativeComponent.ngOnChanges();

          }
        }    
      }
    });
  }

  protected moveFinish() {
    this.inputService.onMouseUp((event) => {
      if (this.movedOperand && this.menuComponent.editMode) {

        /*let moved_fragment_id = this.movedOperand.interactionFragmentModel.id;

        //this.jobsService.start('moveFragment.fragment.' + this.movedOperand.interactionFragmentModel.id);

        let fragmentCount = Math.abs(this.movedOperandIndex - this.originalIndex) + 1;

        for (let i = Math.min(this.movedOperandIndex,this.originalIndex); i <= Math.max(this.movedOperandIndex,this.originalIndex); i++) {

          let current_frag = this.parentCombinedFragment.interactionFragmentModel.children[i];
          let occurrence_count = current_frag.recursiveMessages * 2;

          let saveListen = () => {
            occurrence_count--;

            if (occurrence_count == 0) {
              current_frag.save().subscribe(()=>{
                //fragmentCount--;

                //if (fragmentCount == 0) {
                //  this.jobsService.finish('moveFragment.fragment.' + moved_fragment_id);
                //}
              });
            }
          };

          for (let message of this.parentCombinedFragment.interactionFragmentModel.children[i].recursiveMessages) {

            for (let occurrence of [message.sendEvent, message.receiveEvent]) {

              let headers = new Headers({
                'Content-Type': 'application/vnd.api+json',
                'Accept': 'application/vnd.api+json'
              });

              let options = new RequestOptions({ headers: headers });
              let url = "/api/v1/occurrence-specifications/" + occurrence.id;

              this.http.patch(url, {
                "data": {
                  "type": "occurrence-specifications",
                  "id": occurrence.id.toString(),
                  "attributes": {
                    "time": occurrence.time.toString(),
                  }
                }
              }, options).subscribe(saveListen);

            }
          }
        }

        /*if (fragmentCount == 0) {
            this.jobsService.finish('moveFragment.fragment.' + moved_fragment_id);
        }*/

        this.movedOperand = null;
        this.movedOperandIndex = -1;
        this.parentCombinedFragment = null;
        this.nextOpIndex = -1;
        this.prevOpIndex = -1;
        this.moveDelta = 0;
        this.originalIndex = -1;

      }
    });
  }

  protected clickedLifelineEvent = null;

  protected cyclicalCollisionDetection(lifelines, times, parent_fragment) {
    let movedMessages = [];
    let movedFragments = [];

    console.log(lifelines);
    console.log(times);

    let redo = true;

    // repeat the collision check each time the collision box changes
    while (redo) {

      redo = false;
      movedMessages = [];
      movedFragments = [];

      for (let message of parent_fragment.fragment.recursiveMessagesOneLevel) {

        // check vertical belonging to collision box
        if (message.sendEvent.time > times[0] && message.sendEvent.time < times[1] && message.receiveEvent.time > times[0] && message.receiveEvent.time < times[1]) {

          // check horizontal belonging to collision box
          let message_lifelines = [message.sendEvent.covered, message.receiveEvent.covered].sort((a,b) => a.order - b.order);

          if ((message_lifelines[0].order >= lifelines[0].order && message_lifelines[0].order <= lifelines[1].order)
          || (message_lifelines[1].order >= lifelines[0].order && message_lifelines[1].order <= lifelines[1].order)) {

            movedMessages.push(message);

            if (message_lifelines[0].order < lifelines[0].order) {
              lifelines[0] = message_lifelines[0];
              redo = true;
            }

            if (message_lifelines[1].order > lifelines[1].order) {
              lifelines[1] = message_lifelines[1];
              redo = true;
            }

            if (redo) {
              break;
            }
          }
        }
      }
      
      // if a collision box size change was detected, redo collision check
      if (redo) {
        continue;
      }

      for (let fragment of parent_fragment.fragment.children) {

        let fragment_lifelines = [fragment.componentObject.leftmost_lifeline, fragment.componentObject.rightmost_lifeline];
        let fragment_envelope = [fragment.componentObject.envelope.min, fragment.componentObject.envelope.max];

        // check vertical belonging to collision box
        if ((fragment_envelope[0] >= times[0] && fragment_envelope[0] <= times[1])
        || (fragment_envelope[1] >= times[0] && fragment_envelope[1] <= times[1])) {

          if ((fragment_lifelines[0].order >= lifelines[0].order && fragment_lifelines[0].order <= lifelines[1].order)
          || (fragment_lifelines[1].order >= lifelines[0].order && fragment_lifelines[1].order <= lifelines[1].order)) {

            movedFragments.push(fragment);

            if (fragment_lifelines[0].order < lifelines[0].order) {
              lifelines[0] = fragment_lifelines[0];
              redo = true;
            }

            if (fragment_lifelines[1].order > lifelines[1].order) {
              lifelines[1] = fragment_lifelines[1];
              redo = true;
            }

            if (fragment_envelope[0] < times[0]) {
              times[0] = fragment_envelope[0];
              redo = true;
            }

            if (fragment_envelope[1] > times[1]) {
              times[1] = fragment_envelope[1];
              redo = true;
            }

            if (redo) {
              break;
            }
          }
        }
      }
    }


    console.log(lifelines);
    console.log(times);

    return [movedMessages, movedFragments, lifelines, times];
  }

  protected createFragmentOnLifelinePoint() {

    this.inputService.onLeftClick((event) => {
      if (event.model.type == 'LifelinePoint' && !this.menuComponent.addingMessages) {

        if (!this.clickedLifelineEvent) {
          this.clickedLifelineEvent = event;
        } else {
          let lifelines = [
            this.datastore.peekRecord(M.Lifeline, this.clickedLifelineEvent.model.lifelineID),
            this.datastore.peekRecord(M.Lifeline, event.model.lifelineID),
          ].sort((a,b) => a.order - b.order);

          let times = [
            this.clickedLifelineEvent.model.time,
            event.model.time
          ].sort((a,b) => a - b);

          let layer = lifelines[0].interaction;

          let active_fragment = layer.fragment;

          let fragments_clicked = [];

          for (let i = 0; i < 2; i++) {

            while (true) {

              let last_checked_fragment = null;

              for (let checked_fragment of active_fragment.children) {

                console.log(checked_fragment);

                if (checked_fragment.componentObject.envelope.min < times[i] && checked_fragment.componentObject.envelope.max > times[i]) {
                  last_checked_fragment = active_fragment = checked_fragment;

                  if (active_fragment.children[0].fragmentable instanceof M.Interaction) {
                    last_checked_fragment = active_fragment = checked_fragment.children[0];
                  }

                  break;
                }

              }

              if (active_fragment != last_checked_fragment) {
                break;
              }            
            }

            fragments_clicked.push(active_fragment);

          }

          if (fragments_clicked[0] != fragments_clicked[1]) {
            return;
          }

          let moved_objects = this.cyclicalCollisionDetection(lifelines, times, fragments_clicked[0].fragmentable);

          let movedFragments = moved_objects[1];
          let movedMessages = moved_objects[0];

          if (movedFragments.length == 0 && movedMessages.length == 0) {
            return;
          }

          let shiftedMessages = [];

          for (let message of layer.fragment.recursiveMessages) {
            if (message.sendEvent.time > times[1]) {
              message.sendEvent.time += 2;
              message.receiveEvent.time += 2;
              shiftedMessages.push(message);
            }
          }

          for (let message of movedMessages) {
            message.sendEvent.time++;
            message.receiveEvent.time++;
            shiftedMessages.push(message);
          }

          for (let fragment of movedFragments) {
            for (let message of fragment.recursiveMessages) {
              message.sendEvent.time++;
              message.receiveEvent.time++;
              shiftedMessages.push(message);
            }
          }
          
          let now = Date.now();

          // combined fragment
          let new_combined = this.datastore.createRecord(M.CombinedFragment,{
            name: "combined_fragment",
            operator: "opt",
            created_at: now,
            updated_at: now,
          });
          let nc_ifrag = this.datastore.createRecord(M.InteractionFragment,{
            name: "interaction_fragment",
            created_at: now,
            updated_at: now,
          });

          // interaction operand
          let new_operand = this.datastore.createRecord(M.InteractionOperand,{
            name: "interaction_operand",
            constraint: "<<None>>",
            created_at: now,
            updated_at: now,
          });
          let no_ifrag = this.datastore.createRecord(M.InteractionFragment,{
            name: "interaction_fragment",
            created_at: now,
            updated_at: now,
          });

          // interaction
          let new_interaction = this.datastore.createRecord(M.Interaction,{
            name: "interaction",
            created_at: now,
            updated_at: now,
          });
          let ni_ifrag = this.datastore.createRecord(M.InteractionFragment,{
            name: "interaction_fragment",
            created_at: now,
            updated_at: now,
          });

          // start job
          this.jobsService.start("createFragment");

          let saves_pending = 3;

          let saveRelationships = () => {

            console.log("Objects linked");

            for (let message of movedMessages) {
              message.interaction = new_interaction;
            }

            for (let fragment of movedFragments) {
              fragment.parent = new_interaction.fragment;
            }

            let observables = [];

            let headers = new Headers({
              'Content-Type': 'application/vnd.api+json',
              'Accept': 'application/vnd.api+json'
            });
            let options = new RequestOptions({ headers: headers });
            

            for (let fragment of movedFragments) {
              let url = "/api/v1/interaction-fragments/" + fragment.id;

              observables.push(this.http.patch(url, {
                "data": {
                  "type": "interaction-fragments",
                  "id": fragment.id.toString(),
                  "relationships": {
                    "parent": {
                      "data": {
                        "type": "interaction-fragments",
                        "id": fragment.parent.id.toString()
                      }
                    }
                  }
                }
              }, options));
            }

            for (let message of movedMessages) {
              let url = "/api/v1/messages/" + message.id;

              observables.push(this.http.patch(url, {
                "data": {
                  "type": "messages",
                  "id": message.id.toString(),
                  "relationships": {
                    "interaction": {
                      "data": {
                        "type": "interactions",
                        "id": message.interaction.id.toString()
                      }
                    }
                  }
                }
              }, options));
            }

            for (let message of shiftedMessages) {

              let occurences = [message.sendEvent, message.receiveEvent];

              for (let occurrence of occurences) {
                let url = "/api/v1/occurrence-specifications/" + occurrence.id;

                observables.push(this.http.patch(url, {
                  "data": {
                    "type": "occurrence-specifications",
                    "id": occurrence.id.toString(),
                    "attributes": {
                      "time": occurrence.time.toString(),
                    }
                  }
                }, options));
              }
            }

            saves_pending = observables.length;

            let saveListen = () => {
              saves_pending--;

              if (saves_pending == 0) {
                this.sequenceDiagramComponent.refresh(() => {
                  this.jobsService.finish("createFragment");
                });
              }
            }

            for (let observable of observables) {
              observable.subscribe(saveListen);
            }

          };

          let saveObjects = () => {

            console.log("Lower interaction fragment saved");

            new_combined.fragment = nc_ifrag;
            new_operand.fragment = no_ifrag;
            new_interaction.fragment = ni_ifrag;

            saves_pending = 6;

            let headers = new Headers({
            'Content-Type': 'application/vnd.api+json',
            'Accept': 'application/vnd.api+json'
            });
            let options = new RequestOptions({ headers: headers });
            

            let url = "/api/v1/interaction-fragments/" + nc_ifrag.id;
            this.http.patch(url, {
              "data": {
                "type": "interaction-fragments",
                "id": nc_ifrag.id.toString(),
                "relationships": {
                  "parent": {
                    "data": {
                      "type": "interaction-fragments",
                      "id": nc_ifrag.parent.id.toString()
                    }
                  },
                  "fragmentable": {
                    "data": {
                      "type": "combined-fragments",
                      "id": nc_ifrag.fragmentable.id.toString()
                    }
                  }
                }
              }
            }, options).subscribe(() => {
                saves_pending--
                if (saves_pending == 0) {
                  saveRelationships();
                }
            });

            url = "/api/v1/interaction-fragments/" + no_ifrag.id;
            this.http.patch(url, {
              "data": {
                "type": "interaction-fragments",
                "id": no_ifrag.id.toString(),
                "relationships": {
                  "parent": {
                    "data": {
                      "type": "interaction-fragments",
                      "id": no_ifrag.parent.id.toString()
                    }
                  },
                  "fragmentable": {
                    "data": {
                      "type": "interaction-operands",
                      "id": no_ifrag.fragmentable.id.toString()
                    }
                  }
                }
              }
            }, options).subscribe(() => {
                saves_pending--
                if (saves_pending == 0) {
                  saveRelationships();
                }
            });

            url = "/api/v1/interaction-fragments/" + ni_ifrag.id;
            this.http.patch(url, {
              "data": {
                "type": "interaction-fragments",
                "id": ni_ifrag.id.toString(),
                "relationships": {
                  "parent": {
                    "data": {
                      "type": "interaction-fragments",
                      "id": ni_ifrag.parent.id.toString()
                    }
                  },
                  "fragmentable": {
                    "data": {
                      "type": "interactions",
                      "id": ni_ifrag.fragmentable.id.toString()
                    }
                  }
                }
              }
            }, options).subscribe(() => {
                saves_pending--
                if (saves_pending == 0) {
                  saveRelationships();
                }
            });

            url = "/api/v1/combined-fragments/" + new_combined.id;
            this.http.patch(url, {
              "data": {
                "type": "combined-fragments",
                "id": new_combined.id.toString(),
                "relationships": {
                  "fragment": {
                    "data": {
                      "type": "interaction-fragments",
                      "id": new_combined.fragment.id.toString()
                    }
                  }
                }
              }
            }, options).subscribe(() => {
                saves_pending--
                if (saves_pending == 0) {
                  saveRelationships();
                }
            });

            url = "/api/v1/interaction-operands/" + new_operand.id;
            this.http.patch(url, {
              "data": {
                "type": "interaction-operands",
                "id": new_operand.id.toString(),
                "relationships": {
                  "fragment": {
                    "data": {
                      "type": "interaction-fragments",
                      "id": new_operand.fragment.id.toString()
                    }
                  }
                }
              }
            }, options).subscribe(() => {
                saves_pending--
                if (saves_pending == 0) {
                  saveRelationships();
                }
            });

            url = "/api/v1/interactions/" + new_interaction.id;
            this.http.patch(url, {
              "data": {
                "type": "interactions",
                "id": new_interaction.id.toString(),
                "relationships": {
                  "fragment": {
                    "data": {
                      "type": "interaction-fragments",
                      "id": new_interaction.fragment.id.toString()
                    }
                  }
                }
              }
            }, options).subscribe(() => {
                saves_pending--
                if (saves_pending == 0) {
                  saveRelationships();
                }
            });
          };

          let saveInteractionFragments = () => {

            saves_pending--;

            if (saves_pending == 0) {

              console.log("Combined fragment saved");

              nc_ifrag.fragmentable = new_combined;
              no_ifrag.fragmentable = new_operand;
              ni_ifrag.fragmentable = new_interaction;

              nc_ifrag.parent = fragments_clicked[0];
              nc_ifrag.save().subscribe(() => {
                console.log("Upper interaction fragment saved");
                no_ifrag.parent = nc_ifrag;
                no_ifrag.save().subscribe(() => {
                  console.log("Middle interaction fragment saved");
                  ni_ifrag.parent = no_ifrag;
                  ni_ifrag.save().subscribe(saveObjects);
                });
              });
            }
          }

          new_combined.save().subscribe(saveInteractionFragments);
          new_operand.save().subscribe(saveInteractionFragments);
          new_interaction.save().subscribe(saveInteractionFragments);
          

          this.clickedLifelineEvent = null;
        }
      }
    });

  }

  protected layerizedCombinedFragments = [];
  
  protected fragmentBeingLayerized = null;

  protected layerize() {

    this.inputService.onRightClick((event) => {

      if (!this.menuComponent.editMode && event.model.type =='CombinedFragment') {
        
        let combined_fragment = this.datastore.peekRecord(M.CombinedFragment, event.model.id);

        // click bubble
        if (this.fragmentBeingLayerized == null) {
          this.fragmentBeingLayerized = combined_fragment;
        }

        if (!(combined_fragment.fragment.parent.fragmentable.isLayerInteraction ||
         (combined_fragment.fragment.parent.parent && combined_fragment.fragment.parent.parent.parent && combined_fragment.fragment.parent.parent.parent.fragmentable.isLayerInteraction))) {
          return;
        }
        

        combined_fragment = this.fragmentBeingLayerized;
        this.fragmentBeingLayerized = null;

        if (this.layerizedCombinedFragments.indexOf(combined_fragment) != -1) {

        } else {
          // apply layerization
          if (combined_fragment.fragment.children.length == 1) {
            return;
          }

          this.layerizedCombinedFragments.push(combined_fragment);

          // get all fragments except the first one
          let layerizable_fragments = combined_fragment.fragment.children.slice().sort((a,b) => a.componentObject.envelope.min - b.componentObject.envelope.min).slice(1);

          let current_fragment = combined_fragment.fragment;

          while  (!(current_fragment.fragmentable instanceof M.Interaction && current_fragment.fragmentable.isLayerInteraction)) {
            current_fragment = current_fragment.parent;
          }

          // get lifelines of the parent layer
          let lifelines_to_add = current_fragment.fragmentable.lifelines;

          let i = this.sequenceDiagramComponent.rootInteractionFragment.children.indexOf(current_fragment) + 1;

          combined_fragment.fragment.original_children = combined_fragment.fragment.children.slice();

          // iterate layerizable fragments
          for (let fragment of layerizable_fragments) {

            // make and bind fake layer and interaction fragment
            let new_layer = new M.Interaction(null);
            new_layer.name = combined_fragment.operator + " " + fragment.fragmentable.constraint;
            let nl_ifrag = new M.InteractionFragment(null);
            new_layer.fragment = nl_ifrag;
            nl_ifrag.fragmentable = new_layer;
            nl_ifrag.parent = this.sequenceDiagramComponent.rootInteractionFragment;

            // add lifelines
            new_layer.lifelines = lifelines_to_add;

            // add messages
            for (let message of fragment.recursiveMessagesOneLevel) {
              message.interaction = new_layer;
              new_layer.messages.push(message);
            }

            // add fragments
            for (let child_combined_fragment of fragment.children[0].children) {
              new_layer.fragment.children.push(child_combined_fragment);
            }

            // add to sequence diagram
            fragment.parent = nl_ifrag;
            this.sequenceDiagramComponent.rootInteractionFragment.children.splice(i,0,nl_ifrag);
            i++;
          }

          combined_fragment.fragment.children.splice(1,combined_fragment.fragment.children.length - 1);

          current_fragment.componentObject.nativeComponent.ngOnChanges();
          

        }
      }
    });
  }

  protected addOperandOnFragmentPulley() {
    this.inputService.onMouseDown((event) => {

      if (event.model.type == 'FragmentPulley' && this.menuComponent.editMode && !this.menuComponent.addingMessages) {

        // get the operand being split
        let pulley = event.model.component;
        let clickedOperand = pulley.fragment;
        let clickedOperandInteraction = clickedOperand.interactionFragmentModel.children[0];

        // end if there is no content to split between the new fragment and the old one
        if (clickedOperandInteraction.children.length + clickedOperandInteraction.recursiveMessagesOneLevel.length <= 1) {
          return;
        }

        let closest_message = null;
        let closest_fragment  = null;

        let click_time = pulley.isTop ? clickedOperand.envelope.min : clickedOperand.envelope.max;

        for (let message of clickedOperandInteraction.recursiveMessagesOneLevel) {
          if (closest_message == null || Math.abs(click_time - message.sendEvent.time) < Math.abs(click_time - closest_message.sendEvent.time)) {
            closest_message = message;
          }
        }

        for (let fragment of clickedOperandInteraction.children) {
          if (closest_fragment == null || Math.abs(click_time - fragment.componentObject.envelope.min) < Math.abs(click_time - closest_fragment.componentObject.envelope.min)) {
            closest_fragment = fragment;
          }
        }

        let now = Date.now();

        // operand
        let new_operand = this.datastore.createRecord(M.InteractionOperand,{
          name: "interaction_operand",
          constraint: "<<None>>",
          created_at: now,
          updated_at: now,
        });
        let no_ifrag = this.datastore.createRecord(M.InteractionFragment,{
          name: "interaction_fragment",
          created_at: now,
          updated_at: now,
        });

        // interaction
        let new_interaction = this.datastore.createRecord(M.Interaction,{
          name: "interaction",
          created_at: now,
          updated_at: now,
        });
        let ni_ifrag = this.datastore.createRecord(M.InteractionFragment,{
          name: "interaction_fragment",
          created_at: now,
          updated_at: now,
        });

        if (!closest_fragment || (closest_message && Math.abs(click_time - closest_message.sendEvent.time) < Math.abs(click_time - closest_fragment.componentObject.envelope.min))) {
          closest_message.interaction = new_interaction;
          closest_fragment = null;
        } else {
          closest_fragment.parent = ni_ifrag;
          closest_message = null;
        }

        this.jobsService.start("addOperand");

        let saves_pending = 2;

        let editedMessages = [];
        let borderTime = closest_fragment ? pulley.isTop ? closest_fragment.componentObject.envelope.max : closest_fragment.componentObject.envelope.min : closest_message ? closest_message.sendEvent.time - 1 : Number.MAX_SAFE_INTEGER;

        let current_fragment = clickedOperandInteraction;

        while  (!(current_fragment.fragmentable instanceof M.Interaction && current_fragment.fragmentable.isLayerInteraction)) {
          current_fragment = current_fragment.parent;
        }

        for (let message of current_fragment.recursiveMessages) {

          if (borderTime < message.sendEvent.time) {
            message.sendEvent.time++;
            message.receiveEvent.time++;
            editedMessages.push(message);
          }

        }

        let saveTypes = () => {
          saves_pending--;
          if (saves_pending == 0) {

            no_ifrag.fragmentable = new_operand;
            no_ifrag.parent = clickedOperand.interactionFragmentModel.parent;
            ni_ifrag.fragmentable = new_interaction;
            ni_ifrag.parent = no_ifrag;

            no_ifrag.save().subscribe(() => {
              ni_ifrag.save().subscribe(() => {

                new_operand.fragment = no_ifrag;
                new_interaction.fragment = ni_ifrag;

                let url;
                let headers = new Headers({
                'Content-Type': 'application/vnd.api+json',
                'Accept': 'application/vnd.api+json'
                });
                let options = new RequestOptions({ headers: headers });

                saves_pending = 4;

                let saveRelationships = () => {

                  let save_following_messages = () => {
                    saves_pending--;

                    if (saves_pending == 0) {
                      this.jobsService.finish("addOperand");
                      this.sequenceDiagramComponent.refresh();
                    }
                  };

                  saves_pending = 1;

                  if (closest_message) {
                    let url = "/api/v1/messages/" + closest_message.id;

                    this.http.patch(url, {
                      "data": {
                        "type": "messages",
                        "id": closest_message.id.toString(),
                        "relationships": {
                          "interaction": {
                            "data": {
                              "type": "interactions",
                              "id": closest_message.interaction.id.toString()
                            }
                          }
                        }
                      }
                    }, options).subscribe(save_following_messages);
                  }

                  if (closest_fragment) {
                    url = "/api/v1/interaction-fragments/" + closest_fragment.id;
                    this.http.patch(url, {
                      "data": {
                        "type": "interaction-fragments",
                        "id": closest_fragment.id.toString(),
                        "relationships": {
                          "parent": {
                            "data": {
                              "type": "interaction-fragments",
                              "id": closest_fragment.parent.id.toString()
                            }
                          },
                        }
                      }
                    }, options).subscribe(save_following_messages);
                  }

                  saves_pending += 2 * editedMessages.length;

                  for (let message of editedMessages) {
                    for (let occurrence of [message.sendEvent, message.receiveEvent]) {
                      let url = "/api/v1/occurrence-specifications/" + occurrence.id;

                      this.http.patch(url, {
                        "data": {
                          "type": "occurrence-specifications",
                          "id": occurrence.id.toString(),
                          "attributes": {
                            "time": occurrence.time.toString(),
                          }
                        }
                      }, options).subscribe(save_following_messages);
                    }
                  }

                };

                url = "/api/v1/interaction-fragments/" + no_ifrag.id;
                this.http.patch(url, {
                  "data": {
                    "type": "interaction-fragments",
                    "id": no_ifrag.id.toString(),
                    "relationships": {
                      "parent": {
                        "data": {
                          "type": "interaction-fragments",
                          "id": no_ifrag.parent.id.toString()
                        }
                      },
                      "fragmentable": {
                        "data": {
                          "type": "interaction-operands",
                          "id": no_ifrag.fragmentable.id.toString()
                        }
                      }
                    }
                  }
                }, options).subscribe(() => {
                    saves_pending--
                    if (saves_pending == 0) {
                      saveRelationships();
                    }
                });

                url = "/api/v1/interaction-fragments/" + ni_ifrag.id;
                this.http.patch(url, {
                  "data": {
                    "type": "interaction-fragments",
                    "id": ni_ifrag.id.toString(),
                    "relationships": {
                      "parent": {
                        "data": {
                          "type": "interaction-fragments",
                          "id": ni_ifrag.parent.id.toString()
                        }
                      },
                      "fragmentable": {
                        "data": {
                          "type": "interactions",
                          "id": ni_ifrag.fragmentable.id.toString()
                        }
                      }
                    }
                  }
                }, options).subscribe(() => {
                    saves_pending--
                    if (saves_pending == 0) {
                      saveRelationships();
                    }
                });

                url = "/api/v1/interaction-operands/" + new_operand.id;
                this.http.patch(url, {
                  "data": {
                    "type": "interaction-operands",
                    "id": new_operand.id.toString(),
                    "relationships": {
                      "fragment": {
                        "data": {
                          "type": "interaction-fragments",
                          "id": new_operand.fragment.id.toString()
                        }
                      }
                    }
                  }
                }, options).subscribe(() => {
                    saves_pending--
                    if (saves_pending == 0) {
                      saveRelationships();
                    }
                });

                url = "/api/v1/interactions/" + new_interaction.id;
                this.http.patch(url, {
                  "data": {
                    "type": "interactions",
                    "id": new_interaction.id.toString(),
                    "relationships": {
                      "fragment": {
                        "data": {
                          "type": "interaction-fragments",
                          "id": new_interaction.fragment.id.toString()
                        }
                      }
                    }
                  }
                }, options).subscribe(() => {
                    saves_pending--
                    if (saves_pending == 0) {
                      saveRelationships();
                    }
                });
              });

            });
          }
        };

        new_operand.save().subscribe(saveTypes);
        new_interaction.save().subscribe(saveTypes);

      }

    });
  }

// generates observables for fragment deletion
  public deleteEmptyFragments(combined_fragment) {

    let observables = [];
    // delete empty fragments
    for (let fragment of combined_fragment.interactionFragmentModel.children) {
      if (fragment.recursiveMessages.map((a) => a.interaction == fragment.children[0].fragmentable).reduce((acc, val)=> acc || val) == false) {
        
        //observables.push(this.datastore.deleteRecord(M.Interaction, fragment.children[0].fragmentable.id));
        //observables.push(this.datastore.deleteRecord(M.InteractionOperand, fragment.fragmentable.id));
        observables.push(this.datastore.deleteRecord(M.InteractionFragment, fragment.children[0].id));
        observables.push(this.datastore.deleteRecord(M.InteractionFragment, fragment.id));
        
      }
    }

    if (observables.length == 2 * combined_fragment.interactionFragmentModel.children.length) {
      observables.push(this.datastore.deleteRecord(M.InteractionFragment, combined_fragment.interactionFragmentModel.id));
    }

    return observables;
  }

  protected editedFragment = null;

  protected editFragmentText() {

    this.inputService.onDoubleClick((event) => {

      let editedFragment = this.editedFragment;

      if (this.menuComponent.editMode && !this.sequenceDiagramController.deleteInProgress && event.model.type == 'CombinedFragment' && this.editedFragment == null) {
        this.editedFragment = this.datastore.peekRecord(M.CombinedFragment, event.model.id);
      }

      if (this.menuComponent.editMode && !this.sequenceDiagramController.deleteInProgress && event.model.type == 'InteractionOperand' && this.editedFragment == null) {
        this.editedFragment = this.datastore.peekRecord(M.InteractionOperand, event.model.id);
      }

      if (this.menuComponent.editMode && !this.sequenceDiagramController.deleteInProgress && event.model.type == 'Layer' && this.editedFragment != null) {

        if (this.editedFragment instanceof M.CombinedFragment) {
          // Open dialog
          this.dialogService.createEditDialog("Edit combined fragment", this.editedFragment, "Enter combined fragment operator", "combinedFragment")
            .componentInstance.onOk.subscribe((result) => {
            // Start job
            this.jobsService.start('editCombinedFragmentOperator');
            // Edit operand
            editedFragment.operator = result.messageSort;
            editedFragment.save().subscribe(() => {
              // Finish job
              this.jobsService.finish('editCombinedFragmentOperator');
            });
          });
        } else {
          // Open dialog
          this.dialogService.createEditDialog("Edit interaction operand", {}, "Enter interaction operand constraint(space for empty)", "interactionOperand")
            .componentInstance.onOk.subscribe((result) => {
            // Start job
            this.jobsService.start('editInteractionOperandConstraint');
            // Edit operand
            console.log(result.name);
            editedFragment.constraint = result.name;
            editedFragment.save().subscribe(() => {
              // Finish job
              this.jobsService.finish('editInteractionOperandConstraint');
            });
          });
        }
        
        this.editedFragment = null;
      }

      
    });

  }
  
}