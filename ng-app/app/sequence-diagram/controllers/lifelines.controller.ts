import { Datastore } from '../../datastore';
import { DialogService } from '../../dialog/services';
import { MenuComponent } from '../../menu/components/menu.component';
import * as M from '../../sequence-diagram/models';
import { LifelineComponent } from '../components/lifeline.component';
import { SequenceDiagramComponent } from '../components/sequence-diagram.component';
import { JobsService, SequenceDiagramService } from '../services';
import { InputService } from '../services/input.service';
import { SequenceDiagramController } from './sequence-diagram.controller';
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
    this.dialogService.createEditDialog("Create lifeline", "", "Enter name of new lifeline", "lifeline")
      .componentInstance.onOk.subscribe(result => {

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
          name: result.name,
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
        if (lifelinesInInteraction.length == 1) {
          draggingLifelineComponent.left = 0;
          // Prestaneme hybat s lifeline
          draggingLifelineComponent = null;
          return;
        }
        let lifelineOrder = draggingLifelineModel.order;

        // Pozicia 1 je medzi suradnicami 0-125px
        let position = 0, count = 1;
        let orderBot = 0, orderTop = 125;
        let diagramX = 0;

        // Najdi poziciu, na ktoru som pustil lifeline
        while (position == 0) {
          // Lifeline som pustil niekde medzi suradnicami horneho a dolneho ohranicenia pozicie
          if (event.diagramX < orderTop && event.diagramX >= orderBot) {
            position = count;
            diagramX = orderTop;
            break;
          // Ak nie, posuniem hranice o 400px (vzdialenost medzi lifeline)
          } else {
            count++;
            orderBot = orderTop;
            orderTop += 400;
          }
        }

        // Ak lifeline posuniem hocikam na koniec, pozicia bude vzdy iba o 1 vyssia ako pocet lifeline
        if (position > lifelinesInInteraction.length) {
          position = lifelinesInInteraction.length + 1;
        }

        // Osetrenie pripadu, kedy su iba dve lifeline
        if (position > draggingLifelineModel.order && lifelinesInInteraction.length > 1) {
          position--;
        }

        // Zafixujeme polohu lifeline 
        if (position == draggingLifelineModel.order) {
          draggingLifelineComponent.left = (position - 1) * 400;
          // Prestaneme hybat s lifeline
          draggingLifelineComponent = null;
          return;
        }

        // Start job
        this.jobsService.start('reorderLifeline');

        let originalOrder = draggingLifelineModel.order;

        // Opakujem pre vsetky lifeline ktore su v interakcii
        for (let lifeline of lifelinesInInteraction) {
          // Lifeline, ktoru posuvam prehodim na jej nove miesto a ulozim do DB
          if (lifeline.id == draggingLifelineModel.id) {
            lifeline.order = position;
            this.jobsService.start('reorderLifeline.lifeline.' + lifeline.id);
            // Ulozime lifeline na jej nove miesto
            lifeline.save().subscribe(() => {
              this.jobsService.finish('reorderLifeline.lifeline.' + lifeline.id);
            });
            continue;
          }
          // Lifeline musim posunut o 1 dolava, aby za nu mohla ist nova
          else if (lifeline.order >= originalOrder && lifeline.order <= position) {
            lifeline.order--;
            this.jobsService.start('reorderLifeline.lifeline.' + lifeline.id);
            // Ulozime lifeline s o 1 nizsou poziciou do DB
            lifeline.save().subscribe(() => {
              this.jobsService.finish('reorderLifeline.lifeline.' + lifeline.id);
            });
            continue;
          }
          // Posunul som lifeline pred tuto, teda musim ju posunut o 1 do prava
          else if (lifeline.order < originalOrder && lifeline.order >= position) {
            lifeline.order++;
            this.jobsService.start('reorderLifeline.lifeline.' + lifeline.id);
            // Ulozime lifeline s o 1 vacsou poziciou do DB
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
        //Vyberieme vsetky Occurence Specifications na lifeline
        let occurences = lifeline.occurrenceSpecifications;
        let occurencesToDelete = [];
        for (let occurence of occurences) {
          // Oznacime occurence specifications, ktore su na lifeline na zmazanie 
          occurencesToDelete.push(occurence);
          let messages = occurence.sendingEventMessages;
          for (let message of messages) {
            // Pridame occ spec na prijimacej strane message
            occurencesToDelete.push(message.receiveEvent);
          }
          messages = occurence.receivingEventMessages;
          for (let message of messages) {
            // Pridame occ spec na odosielacej strane message
            occurencesToDelete.push(message.sendEvent);
          }
        }
        // Zmaz vsetky occurence specification, ktore su ovplyvnenie zmazanim lifeline
        for (let occurence of occurencesToDelete) {
          this.jobsService.start('deleteOccurrenceSpecification.occurrenceSpecification.' + occurence.id);
          this.datastore.deleteRecord(M.OccurrenceSpecification, occurence.id).subscribe(() => {
            this.jobsService.finish('deleteOccurrenceSpecification.occurrenceSpecification.' + occurence.id);
          });
        }
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
  protected _relaxLifelinesOrder(lifelineNew: M.Lifeline) {
    let lifelinesInInteraction = lifelineNew.interaction.lifelines;
    for (let lifeline of lifelinesInInteraction) {
      if (lifeline.order > lifelineNew.order) {
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