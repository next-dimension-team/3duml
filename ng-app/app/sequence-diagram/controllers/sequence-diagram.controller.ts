import { Datastore } from '../../datastore';
import { DialogService } from '../../dialog/services';
import { MenuComponent } from '../../menu/components/menu.component';
import * as M from '../../sequence-diagram/models';
import { SequenceDiagramComponent } from '../components/sequence-diagram.component';
import { JobsService, SequenceDiagramService } from '../services';
import { Injectable } from '@angular/core';

@Injectable()
export class SequenceDiagramController {

  /* Sequence Diagram Component Instance */
  public sequenceDiagramComponent: SequenceDiagramComponent = null;

  /* Menu Component Instance */
  public menuComponent: MenuComponent = null;

  constructor(
    protected sequenceDiagramService: SequenceDiagramService,
    protected dialogService: DialogService,
    protected jobsService: JobsService,
    protected datastore: Datastore
  ) {}

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

}