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

  /* Delete operation variable */
  public deleteInProgress: boolean = false;

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
    this.dialogService.createEditDialog(
      'Creating diagram', '', 'Enter name of new digram.', 'diagram')
      .componentInstance.onOk.subscribe((result) => {

        // Start job
        this.jobsService.start('createDiagram');

        // Create interaction
        this.datastore.createRecord(M.Interaction, {
          name: result.name
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
      });
  }

  /*
   * Rename Diagram
   */
  public renameDiagram(sequenceDiagram: M.Interaction): void {
    this.dialogService.createEditDialog(
      'Edit Diagram', sequenceDiagram, 'Enter Diagram name', 'diagram')
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
      'Delete diagram', 'Do you really want to delete diagram \'' + sequenceDiagram.name + '\' ?')
      .componentInstance.onYes.subscribe((result) => {
        this.jobsService.start('deleteDiagram');
        this.datastore.deleteRecord(M.InteractionFragment, sequenceDiagram.fragment.id)
          .subscribe(() => {
            // Hide opened (deleted) diagram
            if (this.sequenceDiagramComponent) {
              this.sequenceDiagramComponent.rootInteractionFragment = null;
            }
            // Refresh menu component
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
      if (!this.menuComponent.editMode && event.model.type === 'Layer') {
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

          case 'LifelineTitle':
            let lifeline = this.datastore.peekRecord(M.Lifeline, event.model.id);
            this.lifelinesController.deleteLifeline(lifeline);
            break;

          default:
            break;
        }

        // Delete done
        this.deleteInProgress = false;
      }
    });
  }

}
