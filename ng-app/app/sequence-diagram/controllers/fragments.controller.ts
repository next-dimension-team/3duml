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

  /*protected draggedPulley: FragmentPulleyComponent = null;
  protected draggedPulleyOperand: InteractionOperand = null;
  protected draggedPulleyOtherOperand: InteractionOperand = null;
  protected draggedPulleyCombinedFrag: CombinedFragment = null;
  protected topDelta = 0;
  protected bottomDelta = 0;

  public deformFragment() {

    // deform fragment init - set pulley being dragged and fragment being deformed
    this.inputService.onMouseDown((event) => {

      if (event.model.type == 'FragmentPulley') {

        this.draggedPulley = event.model.component;
        this.draggedPulleyOperand = this.draggedPulley.fragment;
        this.draggedPulleyCombinedFrag = this.draggedPulleyOperand.interactionFragmentModel.parent.fragmentable;

        this.topDelta = 0;
        this.bottomDelta = 0;
        
        // find out which child is this fragment
        let index = this.draggedPulleyCombinedFrag.fragment.children.indexOf(this.draggedPulleyOperand.interactionFragmentModel);

        switch (this.draggedPulley.top) {
          case 0: // pulling the top pulley
          if (index == 0) { // if it is the first, there is no fragment in the way of pull
            this.draggedPulleyOtherOperand = null;
          } else {
            this.draggedPulleyOtherOperand = this.draggedPulleyCombinedFrag.fragment.children[index - 1].fragmentable.fragment.componentObject;
          }
          break;
          case 100: // pulling the bottom pulley
          if (index == this.draggedPulleyCombinedFrag.fragment.children.length - 1) { // if it is the last, there is no fragment in the way of pull
            this.draggedPulleyOtherOperand = null;
          } else {
            this.draggedPulleyOtherOperand = this.draggedPulleyCombinedFrag.fragment.children[index + 1].fragmentable.componentObject;
          }
          break;
          case 50: // pulling a side pulley
          this.draggedPulleyOtherOperand = null;
          break;
        }
      }
        
    });

    // deform fragment repeated action - update fragment position
    this.inputService.onMouseMove((event) => {

      if (this.draggedPulley && this.menuComponent.editMode) {
        if (this.draggedPulley.isTop()) {
          this.draggedPulleyOperand.height = this.draggedPulleyOperand.height - event.movementY/4;
          this.topDelta += event.movementY/4;

          // shrink the operand before if it exists, otherwise expand the combined fragment
          if (this.draggedPulleyOtherOperand) {
            this.draggedPulleyOtherOperand.height = this.draggedPulleyOtherOperand.height + event.movementY/4;
          } else {
            this.draggedPulleyCombinedFrag.fragment.componentObject.top = this.draggedPulleyCombinedFrag.fragment.componentObject.top + event.movementY/4;
          }
        }

        if (this.draggedPulley.isBottom()) {
          this.draggedPulleyOperand.height = this.draggedPulleyOperand.height + event.movementY/4;
          this.bottomDelta += event.movementY/4;

          
          if (this.draggedPulleyOtherOperand) {
            this.draggedPulleyOtherOperand.height = this.draggedPulleyOtherOperand.height - event.movementY/4;
          }
        }
      }      

    });

    // deform fragment finish - update relationships and save
    this.inputService.onMouseUp((event) => {

      if (this.draggedPulley && this.menuComponent.editMode) {

        
        let component = this.draggedPulleyCombinedFrag.fragment.componentObject;
        let top = component.top;

        // find out absolute coordinates of fragment to compare with messages by moving up the component tree
        while (component.interactionFragmentModel.parent && component.interactionFragmentModel.parent.parent) {

          component = component.interactionFragmentModel.parent.componentObject;  

          if (component.type == 'CombinedFragment') {
            top += component.top;
          }

          if (component.type == 'InteractionOperand') {
            let fragments_before = component.interactionFragmentModel.parent.children.indexOf(component.interactionFragmentModel);
            for (let i = 0; i < fragments_before; i++) {
              top += component.interactionFragmentModel.parent.children[i].componentObject.height;
            }
          }

          
        }

        // iterate messages to check for ownership changes
        for (let message of component.model.recursiveMessages) {

          // if the message is now in the fragment
          if (message.componentObject.top >= top && message.componentObject.top <= top + this.draggedPulleyOperand.height) {

            // and it was not there before
            if (!(message.componentObject.top >= top - this.topDelta && message.componentObject.top <= top + this.draggedPulleyOperand.height + this.bottomDelta)) {

              // save the fragment change
              message.interaction = this.draggedPulleyOperand.interactionFragmentModel.children[0].fragmentable;
              console.log(message.hasDirtyAttributes && "Yes" || "No");
              message.save().subscribe();

              // TODO save message
            }
          }

           // if the message is now not in the fragment
          if (!(message.componentObject.top >= top && message.componentObject.top <= top + this.draggedPulleyOperand.height)) {

            // and it was there before
            if (message.componentObject.top >= top - this.topDelta && message.componentObject.top <= top + this.draggedPulleyOperand.height + this.bottomDelta) {
              
            }
          }
        }
        //this.refresh();

      }

      this.draggedPulley = null;
      this.draggedPulleyCombinedFrag = null;
      this.draggedPulleyOperand = null;
      this.draggedPulleyOtherOperand = null;

      this.topDelta = 0;
      this.bottomDelta = 0;

    });
  }*/

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

  public deformFragment() {
    this.dragInitialization();
    this.dragOngoing();
    this.dragFinish();
  }

  public moveFragment() {

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
        let deltaY = event.movementY/4;

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

          // move fragments
          /*for (let fragment of this.draggedOperand.interactionFragmentModel.children) {
            console.log(fragment);
          }*/

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
            }
          }

        }

        // delete 0 height fragments

        // Start job
        this.jobsService.start('deformFragment.fragment.' + this.draggedOperand.id);

        let dragOp = this.draggedOperand;

        let messages_finished = 0;

        for (let message of editedMessages) {

          let requests_completed = 0;

          message.sendEvent.save();

          message.receiveEvent.save();
          // send update JSON manually because the library used does not support relationship updates

          let headers = new Headers({
            'Content-Type': 'application/vnd.api+json',
            'Accept': 'application/vnd.api+json'
          });

          let options = new RequestOptions({ headers: headers });
          let url = "/api/v1/messages/" + message.id;

          this.http.patch(url, {
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
          }, options).subscribe(() => {
            messages_finished++;
            if (messages_finished == editedMessages.length) {

              // Finish job
              this.sequenceDiagramComponent.refresh(() => {
                this.jobsService.finish('deformFragment.fragment.' + dragOp.id);
              });
            }
          });

        }

        if (editedMessages.length == 0) {
          // Finish job
          this.sequenceDiagramComponent.refresh(() => {
              this.jobsService.finish('deformFragment.fragment.' + dragOp.id);
          });
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
}