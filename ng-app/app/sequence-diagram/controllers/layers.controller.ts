import { Datastore } from '../../datastore';
import { DialogService } from '../../dialog/services';
import { MenuComponent } from '../../menu/components/menu.component';
import * as M from '../../sequence-diagram/models';
import { SequenceDiagramComponent } from '../components/sequence-diagram.component';
import { JobsService } from '../services';
import { SequenceDiagramController } from './sequence-diagram.controller';
import { Injectable } from '@angular/core';

@Injectable()
export class LayersController {

  /* Sequence Diagram Component Instance */
  public sequenceDiagramComponent: SequenceDiagramComponent = null;

  /* Sequence Diagram Controller Instance */
  public sequenceDiagramController: SequenceDiagramController = null;

  /* Menu Component Instance */
  public menuComponent: MenuComponent = null;

  constructor(
    protected dialogService: DialogService,
    protected jobsService: JobsService,
    protected datastore: Datastore
  ) { }

  /*
   * Create Layer
   * 
   * Táto funkcia vytvorí nové plátno v zadanom sekvenčnom diagrame.
   * 
   */
  public createLayer(): void {
    this.dialogService.createEditDialog("Creating layer", "", "Enter name of new layer.", "layer")
      .componentInstance.onOk.subscribe(result => {

        this.jobsService.start('createLayer');

        let layer = this.datastore.createRecord(M.Interaction, {
          name: result.name
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
   * Rename Layer
   */
  public renameLayer(layer: M.Interaction): void {
    // Open dialog
    this.dialogService.createEditDialog("Edit layer", layer, "Enter Layer name", "layer")
      .componentInstance.onOk.subscribe(result => {
        // Start job
        this.jobsService.start('renameLayer');
        // Rename layer
        layer.name = result.name;
        layer.save().subscribe(() => {
          // Finish job
          this.jobsService.finish('renameLayer');
        });
      });
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