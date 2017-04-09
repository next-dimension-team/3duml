import { LayersController } from './';
import { MessagesController } from './messages.controller';
import { LifelinesController } from './lifelines.controller';
import { Datastore } from '../../datastore';
import { DialogService } from '../../dialog/services';
import { MenuComponent } from '../../menu/components/menu.component';
import * as M from '../../sequence-diagram/models';
import { SequenceDiagramComponent } from '../components/sequence-diagram.component';
import { JobsService, InputService, SequenceDiagramService } from '../services';
import { Injectable } from '@angular/core';

@Injectable()
export class SequenceDiagramController {

  /* Sequence Diagram Component Instance */
  public sequenceDiagramComponent: SequenceDiagramComponent = null;

  /* Menu Component Instance */
  public menuComponent: MenuComponent = null;

  constructor(
    protected sequenceDiagramService: SequenceDiagramService,
    protected lifelinesController: LifelinesController,
    protected layersController: LayersController,
    protected messagesController: MessagesController,
    protected dialogService: DialogService,
    protected inputService: InputService,
    protected jobsService: JobsService,
    protected datastore: Datastore
  ) {
    // Set self to the other controllers
    this.lifelinesController.sequenceDiagramController = this;
    this.layersController.sequenceDiagramController = this;
    this.messagesController.sequenceDiagramController = this;

    // Initialize operations
    this.editLayerAfterDoubleClick();
    this.deleteElement();
  }

  /*
   * Create Diagram
   */
  public createDiagram(): void {
    this.dialogService.createInputDialog("Creating diagram", "", "Enter name of new digram.")
      .componentInstance.onOk.subscribe(name => {

        // Start job
        this.jobsService.start('createDiagram');

        // Create interaction
        this.datastore.createRecord(M.Interaction, {
          name: name
        }).save().subscribe((interaction: M.Interaction) => {

          // Create interaction fragment
          this.datastore.createRecord(M.InteractionFragment, {
            fragmentable: interaction
          }).save().subscribe(() => {

            // Refresh menu
            this.menuComponent.refresh(() => {

              // Job finished
              this.jobsService.finish('createDiagram');
            });
          });
        });

      })
  }

  /*
   * Rename Diagram
   */
  public renameDiagram(sequenceDiagram: M.Interaction): void {
    this.dialogService.createEditDialog(
      "Edit Diagram", sequenceDiagram, "Enter Diagram name", "diagram")
      .componentInstance.onOk.subscribe((result) => {
        this.jobsService.start('renameDiagram');
        sequenceDiagram.name = result.name;
        sequenceDiagram.save().subscribe(() => {
          this.jobsService.finish('renameDiagram');
        });
      });
  }

  /*
   * Delete Diagram
   */
  public deleteDiagram(sequenceDiagram: M.Interaction) {
    this.dialogService.createConfirmDialog(
      "Delete diagram", "Do you really want to delete diagram \"" + sequenceDiagram.name + "\" ?").componentInstance.onYes.subscribe((result) => {
        this.jobsService.start('deleteDiagram');
        this.datastore.deleteRecord(M.InteractionFragment, sequenceDiagram.fragment.id).subscribe(() => {
          this.menuComponent.refresh(() => {
            this.jobsService.finish('deleteDiagram');
          });
        });
      });
  }

  /*
   * Open Selected Layer in the Edit Mode
   */
  protected editLayerAfterDoubleClick(): void {
    this.inputService.onDoubleClick((event) => {
      // Works only in "View" mode
      if (!this.menuComponent.editMode && event.model.type == 'Layer') {
        // Set editing layer
        this.sequenceDiagramComponent.editingLayer = event.model.component.interactionFragmentModel;
        // Open edit mode
        this.menuComponent.editMode = true;
      }
    });
  }

  /*
   * Start delete operation
   */
  public deleteInProgress: boolean = false;

  protected deleteElement(): void {

    let menuComponentCallbackInitialized: boolean = false;

    // If delete operation is in progress and we click on some element,
    // then delete it.
    this.inputService.onLeftClick((event) => {

      // If we change mode to "View", cancel delete operation
      if (!menuComponentCallbackInitialized) {
        menuComponentCallbackInitialized = true;
        this.menuComponent.onModeChange.subscribe((editMode) => {
          if (!editMode) {
            this.deleteInProgress = false;
          }
        });
      }

      if (this.deleteInProgress) {
        switch (event.model.type) {

          case 'Message':
            let message = this.datastore.peekRecord(M.Message, event.model.id);
            this.messagesController.deleteMessage(message);
            break;

          case 'Lifeline':
            let lifeline = this.datastore.peekRecord(M.Lifeline, event.model.id);
            this.dialogService.createConfirmDialog(
              "Delete lifeline", "Do you really want to delete lifeline \"" + lifeline.name + "\" ?").componentInstance.onYes.subscribe(result => {
                this.relaxLifelinesOrder(lifeline);
                this.datastore.deleteRecord(M.Lifeline, lifeline.id).subscribe(() => {
                  this.sequenceDiagramComponent.refresh();
                });
              });
            break;
        }

        // Delete done
        this.deleteInProgress = false;
      }
    });
  }

  /*
   * Funkcia upravuje atribút 'order' na lifeline
   * 
   * Ak je order lifeliny väčší ako order vymazanej
   * lifeliny bude dekrementovaný.
   */
  protected relaxLifelinesOrder(lifeline: M.Lifeline) {
    let lifelinesInInteraction = lifeline.interaction.lifelines;
    for (let lifeline of lifelinesInInteraction) {
      if (lifeline.order > lifeline.order) {
        lifeline.order--;
        // Start job
        this.jobsService.start('relaxLifelinesOrder.' + lifeline.id);
        lifeline.save().subscribe(() => {
          // Finish job
          this.jobsService.finish('relaxLifelinesOrder.' + lifeline.id);
        });
      }
    }
  }





}