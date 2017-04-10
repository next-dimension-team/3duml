import { Injectable } from '@angular/core';
import { FragmentPulleyComponent } from '../components/fragment-pulley.component';
import { CombinedFragment } from '../models/CombinedFragment';
import { InteractionOperand } from '../models/InteractionOperand';
import { SequenceDiagramService } from '../services/sequence.diagram.service';
import { InputService } from '../services/input.service';
import { Datastore } from '../../datastore';
import { MenuComponent } from '../../menu/components/menu.component';

@Injectable()
export class FragmentsController {

  /* Menu Component Instance */
  public menuComponent: MenuComponent = null;

  protected draggedPulley: FragmentPulleyComponent = null;
  protected draggedPulleyOperand: InteractionOperand = null;
  protected draggedPulleyOtherOperand: InteractionOperand = null;
  protected draggedPulleyCombinedFrag: CombinedFragment = null;
  protected topDelta = 0;
  protected bottomDelta = 0;

  constructor(
    protected sequenceDiagramService: SequenceDiagramService,
    protected inputService: InputService,
    protected datastore: Datastore
  ) {
    //
  }

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

      if (this.draggedPulley && this.editMode.valueOf() == true) {
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

      if (this.draggedPulley && this.editMode.valueOf() == true) {

        
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
  }
}