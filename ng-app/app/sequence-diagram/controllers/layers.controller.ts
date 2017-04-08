import { Datastore } from '../../datastore';
import { DialogService } from '../../dialog/services';
import * as M from '../../sequence-diagram/models';
import { SequenceDiagramComponent } from '../components/sequence-diagram.component';
import { JobsService } from '../services';
import { Injectable } from '@angular/core';

@Injectable()
export class LayersController {

  /* Sequence Diagram Component Instance */
  public sequenceDiagramComponent: SequenceDiagramComponent = null;

  constructor(
    protected dialogService: DialogService,
    protected jobsService: JobsService,
    protected datastore: Datastore
  ) {}

  /*
   * Create Layer
   * 
   * Táto funkcia vytvorí nové plátno v zadanom sekvenčnom diagrame.
   * 
   */
  public createLayer(): void {
    this.dialogService.createInputDialog("Creating layer", "", "Enter name of new layer.")
      .componentInstance.onOk.subscribe(name => {

        this.jobsService.start('createLayer');
        
        let layer = this.datastore.createRecord(M.Interaction, {
          name: name
        });
    
        layer.save().subscribe((layer: M.Interaction) => {
          let interactionFragment = this.datastore.createRecord(M.InteractionFragment, {
            fragmentable: layer,
            parent: this.sequenceDiagramComponent.rootInteractionFragment
          });
          interactionFragment.save().subscribe(() => {
            this.sequenceDiagramComponent.refresh(() => {
              this.jobsService.finish('createLayer');
            });
          });
        });

      })
  }

  /*
   * Delete Layer
   * 
   * Táto funkcia odstráni plátno ktoré sa práve edituje.
   * 
   */
  public deleteLayer() {
    this.dialogService.createConfirmDialog(
      "Delete layer", "Do you really want to delete layer \"" + this.sequenceDiagramComponent.editingLayer.fragmentable.name + "\" ?").componentInstance.onYes.subscribe(result => {

        // Start job
        this.jobsService.start('deleteLayer');

        // Delete layer
        this.datastore.deleteRecord(M.InteractionFragment, this.sequenceDiagramComponent.editingLayer.id).subscribe(() => {
          this.sequenceDiagramComponent.refresh(() => {

            // Finish job
            this.jobsService.finish('deleteLayer');
          });
        });
    });
  }

}