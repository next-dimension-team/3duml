import { Datastore } from '../../datastore';
import { DialogService } from '../../dialog/services';
import { MenuComponent } from '../../menu/components/menu.component';
import * as M from '../../sequence-diagram/models';
import { SequenceDiagramComponent } from '../components/sequence-diagram.component';
import { JobsService, SequenceDiagramService } from '../services';
import { InputService } from '../services/input.service';
import { Injectable } from '@angular/core';

@Injectable()
export class MessagesController {

  /* Sequence Diagram Component Instance */
  public sequenceDiagramComponent: SequenceDiagramComponent = null;

  /* Menu Component Instance */
  public menuComponent: MenuComponent = null;

  constructor(
    protected dialogService: DialogService,
    protected jobsService: JobsService,
    protected inputService: InputService,
    protected datastore: Datastore
  ) {
    // Initialize operations
    this.editMessage();
  }

  /*
   * Edit Message
   */
  protected editMessage() {
    this.inputService.onDoubleClick((event) => {
      // Did we double-clicked on lifeline in edit mode ?
      if (this.menuComponent.editMode && event.model.type == 'Message') {
        // Get lifeline model
        let message = this.datastore.peekRecord(M.Message, event.model.id);
        // Open dialog
        this.dialogService.createEditDialog("Edit message", message, "Enter message name", "message").componentInstance.onOk.subscribe((result) => {
          // Start job
          this.jobsService.start('renameMessage');
          // Rename lifeline
          message.name = result.name;
          message.save().subscribe(() => {
            // Finish job
            this.jobsService.finish('renameMessage');
          });
        });
      }
    });
  }

}