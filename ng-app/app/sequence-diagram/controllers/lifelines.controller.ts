import { Datastore } from '../../datastore';
import { DialogService } from '../../dialog/services';
import { MenuComponent } from '../../menu/components/menu.component';
import * as M from '../../sequence-diagram/models';
import { SequenceDiagramComponent } from '../components/sequence-diagram.component';
import { JobsService, SequenceDiagramService } from '../services';
import { InputService } from '../services/input.service';
import { Injectable } from '@angular/core';

@Injectable()
export class LifelinesController {

  /* Sequence Diagram Component Instance */
  public sequenceDiagramComponent: SequenceDiagramComponent = null;

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
      if (this.menuComponent.editMode && event.model.type == 'Lifeline') {
        // Get lifeline model
        let lifeline = this.datastore.peekRecord(M.Lifeline, event.model.id);
        // Open dialog
        this.dialogService.createEditDialog("Edit lifeline", lifeline, "Enter lifeline name", "lifeline")
          .componentInstance.onOk.subscribe(result => {
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

}