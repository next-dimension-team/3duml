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

  public deformFragment() {
    this.dragInitialization();
    this.dragOngoing();
    this.dragFinish();
  }

  public moveFragment() {
    this.moveInitialization();
    this.moveOngoing();
    this.moveFinish();
  }

  protected dragInitialization() {
    this.inputService.onMouseDown((event) => {

      if (event.model.type == 'FragmentPulley' && this.menuComponent.editMode) {
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

      if (this.draggedPulley && this.menuComponent.editMode) {
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
              let envelopeMax = current_operand.envelope.max - (current_operand.envelope.max - current_operand.envelope.min)
              * (current_operand.height / current_operand.original_height);

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

              for (let message of this.affectedCombinedFragment.interactionFragmentModel.parent.recursiveMessagesOneLevel) {
                if (message.sendEvent.time > envelope_min && message.sendEvent.time < envelope_max && editedMessages.indexOf(message) === -1) {
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
                
              }
            }

          } else if (this.draggedPulley.isBottom) {
            let height_delta_sum = 0;

            let envelopeMin;
            let envelopeMax;

            for (let i = this.draggedOpIndex + 1; i >= this.affectedCombinedFragment.interactionFragmentModel.children.size - 1; i++) {
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
              (this.draggedOperand.height / this.draggedOperand.original_height);;

              for (let message of this.affectedCombinedFragment.interactionFragmentModel.parent.recursiveMessagesOneLevel) {
                if (message.sendEvent.time > envelope_min && message.sendEvent.time < envelope_max && editedMessages.indexOf(message) === -1) {
                  message.interaction = targetInteraction;
                  message.sendEvent.time--;
                  message.receiveEvent.time--;
                  editedMessages.push(message);
                }
              }

              // move fragments - only when they are completely removed from their owner
              for (let fragment of this.affectedCombinedFragment.interactionFragmentModel.parent.children) {

                if (fragment.componentObject.envelope.min < envelope_max && fragment.componentObject.envelope.max > envelope_min) {
                  editedFragments.push(fragment);
                  fragment.parent = targetInteraction.fragment;
                  for (let message of fragment.recursiveMessages) {
                    message.sendEvent.time--;
                    message.receiveEvent.time--;
                  }
                }
                
              }
            }
          }

        }

        // delete 0 height fragments

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

        if (editedMessages.length == 0 && editedFragments.length == 0 && occurences.length == 0) {
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

  protected moveInitialization() {

    this.inputService.onMouseDown((event) => {
      if (event.model.type == "InteractionConstraint" && this.menuComponent.editMode) {

        this.movedOperand = event.model.component;
        this.parentCombinedFragment = this.movedOperand.interactionFragmentModel.parent.componentObject;
        this.movedOperandIndex = this.parentCombinedFragment.interactionFragmentModel.children.indexOf(this.movedOperand.interactionFragmentModel);
        this.nextOpIndex = this.movedOperandIndex + 1;
        this.prevOpIndex = this.movedOperandIndex - 1;
        this.moveDelta = 0;

        console.log(this.parentCombinedFragment.interactionFragmentModel.children);

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

        this.movedOperand = null;
        this.movedOperandIndex = -1;
        this.parentCombinedFragment = null;
        this.nextOpIndex = -1;
        this.prevOpIndex = -1;
        this.moveDelta = 0;

      }
    });
  }
}