import { Datastore } from '../../datastore';
import { DialogService } from '../../dialog/services';
import * as M from '../../sequence-diagram/models';
import { SequenceDiagramComponent } from '../components/sequence-diagram.component';
import { JobsService, SequenceDiagramService } from '../services';
import { Injectable } from '@angular/core';

@Injectable()
export class LifelinesController {

  /* Sequence Diagram Component Instance */
  public sequenceDiagramComponent: SequenceDiagramComponent = null;

  constructor(
    protected sequenceDiagramService: SequenceDiagramService,
    protected dialogService: DialogService,
    protected jobsService: JobsService,
    protected datastore: Datastore
  ) {}

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

}