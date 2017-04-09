import { SequenceDiagramController } from './sequence-diagram.controller';
import { Datastore } from '../../datastore';
import { DialogService } from '../../dialog/services';
import { MenuComponent } from '../../menu/components/menu.component';
import * as M from '../../sequence-diagram/models';
import { LifelineComponent } from '../components/lifeline.component';
import { SequenceDiagramComponent } from '../components/sequence-diagram.component';
import { JobsService, SequenceDiagramService } from '../services';
import { InputService } from '../services/input.service';
import { Injectable } from '@angular/core';

@Injectable()
export class LifelinesController {

  /* Sequence Diagram Component Instance */
  public sequenceDiagramComponent: SequenceDiagramComponent = null;

  /* Sequence Diagram Controller Instance */
  public sequenceDiagramController: SequenceDiagramController = null;

  /* Menu Component Instance */
  public menuComponent: MenuComponent = null;

  constructor(
    protected sequenceDiagramService: SequenceDiagramService,
    protected dialogService: DialogService,
    protected jobsService: JobsService,
    protected inputService: InputService,
    protected datastore: Datastore
  ) {
    // Initialize operations
    this.renameLifeline();
    this.reorderLifeline();
  }

  /*
   * Create Lifeline
   * 
   * Táto funkcia vytvorí novú lifelinu úplne napravo v danom plátne.
   * 
   */
  public createLifeline(): void {
    this.dialogService.createInputDialog("Create lifeline", "", "Enter name of new lifeline")
      .componentInstance.onOk.subscribe(name => {

        this.jobsService.start('createLifeline');

        // Najskôr zistíme maximálne poradie lifeline
        let maxOrder: number = 0;
        let lifelines: Array<M.Lifeline> = this.sequenceDiagramComponent.editingLayer.fragmentable.lifelines;

        for (let lifeline of lifelines) {
          if (lifeline.order > maxOrder) {
            maxOrder = lifeline.order;
          }
        }

        // Vytvoríme lifelinu úplne nakonci
        this.datastore.createRecord(M.Lifeline, {
          name: name,
          order: maxOrder + 1,
          interaction: this.sequenceDiagramComponent.editingLayer.fragmentable
        }).save().subscribe(() => {
          this.sequenceDiagramComponent.refresh(() => {
            this.jobsService.finish('createLifeline');
          });
        });

      });
  }

  /*
   * Rename Lifeline
   */
  protected renameLifeline() {
    this.inputService.onDoubleClick((event) => {
      // Did we double-clicked on lifeline in edit mode ?
      if (this.menuComponent.editMode && !this.sequenceDiagramController.deleteInProgress && event.model.type == 'Lifeline') {
        // Get lifeline model
        let lifeline = this.datastore.peekRecord(M.Lifeline, event.model.id);
        // Open dialog
        this.dialogService.createEditDialog("Edit lifeline", lifeline, "Enter lifeline name", "lifeline")
          .componentInstance.onOk.subscribe((result) => {
            // Start job
            this.jobsService.start('renameLifeline');
            // Rename lifeline
            lifeline.name = result.name;
            lifeline.save().subscribe(() => {
              // Finish job
              this.jobsService.finish('renameLifeline');
            });
          });
      }
    });
  }

  /*
   * Reorder Lifeline
   */
  protected reorderLifeline() {
    let dragging: boolean = false;
    let draggingLifelineModel: M.Lifeline;
    let draggingLifelineComponent: LifelineComponent = null;

    // Chytili sme lifelinu
    this.inputService.onMouseDown((event) => {
      if (this.menuComponent.editMode && !this.sequenceDiagramController.deleteInProgress && event.model.type == 'LifelineTitle') {
        draggingLifelineComponent = event.model.component;
        draggingLifelineModel = this.datastore.peekRecord(M.Lifeline, event.model.id);
        dragging = true;
      }
    });

    // Keď hýbem myšou, lifelina sa hýbe spolu s myšou
    this.inputService.onMouseMove((event) => {
      if (this.menuComponent.editMode && !this.sequenceDiagramController.deleteInProgress && dragging) {
        draggingLifelineComponent.left = event.diagramX - 125;
      }
    });

    // Lifelinu som pustil na jej nové miesto
    this.inputService.onMouseUp((event) => {
      if (this.menuComponent.editMode && !this.sequenceDiagramController.deleteInProgress && dragging) {
        dragging = false;

        let interaction = draggingLifelineModel.interaction;
        let lifelinesInInteraction = interaction.lifelines;
        let lifelineOrder = draggingLifelineModel.order;

        let position = 0, count = 1;
        let orderBot = 0, orderTop = 125;
        let diagramX = 0;

        // TODO: komentár k tomuto
        while (position == 0) {
          if (event.diagramX < orderTop && event.diagramX > orderBot) {
            position = count;
            diagramX = orderTop;
            break;
          } else {
            count++;
            orderBot = orderTop;
            orderTop += 400;
          }
        }

        // TODO: komentár k tomuto
        if (position > lifelinesInInteraction.length) {
          position = lifelinesInInteraction.length + 1;
        }

        // TODO: komentár k tomuto
        if (position > draggingLifelineModel.order && lifelinesInInteraction.length > 2) {
          position--;
        }

        // TODO: komentár k tomuto
        if (position == draggingLifelineModel.order) {
          draggingLifelineComponent.left = (position - 1) * 400;
          draggingLifelineComponent = null;
          return;
        }

        // Start job
        this.jobsService.start('reorderLifeline');

        let originalOrder = draggingLifelineModel.order;

        // TODO: komentár k tomuto
        for (let lifeline of lifelinesInInteraction) {
          if (lifeline.id == draggingLifelineModel.id) {
            lifeline.order = position;
            this.jobsService.start('reorderLifeline.lifeline.' + lifeline.id);
            lifeline.save().subscribe(() => {
              this.jobsService.finish('reorderLifeline.lifeline.' + lifeline.id);
            });
            continue;
          }
          else if (lifeline.order >= originalOrder && lifeline.order <= position) {
            lifeline.order--;
            this.jobsService.start('reorderLifeline.lifeline.' + lifeline.id);
            lifeline.save().subscribe(() => {
              this.jobsService.finish('reorderLifeline.lifeline.' + lifeline.id);
            });
            continue;
          }
          else if (lifeline.order < originalOrder && lifeline.order >= position) {
            lifeline.order++;
            this.jobsService.start('reorderLifeline.lifeline.' + lifeline.id);
            lifeline.save().subscribe(() => {
              this.jobsService.finish('reorderLifeline.lifeline.' + lifeline.id);
            });
            continue;
          }
        }

        this.sequenceDiagramComponent.refresh(() => {
          // Finish job
          this.jobsService.finish('reorderLifeline');
        });

        draggingLifelineComponent = null;
        draggingLifelineModel = null;

      }
    });
  }

  /*
   * Delete Lifeline
   */
  public deleteLifeline(lifeline: M.Lifeline): void {
    this.dialogService.createConfirmDialog(
      "Delete lifeline", "Do you really want to delete lifeline \"" + lifeline.name + "\" ?").componentInstance.onYes.subscribe(result => {
        this._relaxLifelinesOrder(lifeline);
        // Start job
        this.jobsService.start('deleteLifeline');
        this.datastore.deleteRecord(M.Lifeline, lifeline.id).subscribe(() => {
          this.sequenceDiagramComponent.refresh(() => {
            // Finish job
            this.jobsService.finish('deleteLifeline');
          });
        });
      });
  }



  /*
   * Pomocná funkcia upravuje atribút 'order' na lifeline
   * 
   * Ak je order lifeliny väčší ako order vymazanej
   * lifeliny bude dekrementovaný.
   */
  protected _relaxLifelinesOrder(lifeline: M.Lifeline) {
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