import { Datastore } from '../../datastore';
import { DialogService } from '../../dialog/services';
import { MenuComponent } from '../../menu/components/menu.component';
import * as M from '../../sequence-diagram/models';
import { SequenceDiagramComponent } from '../components/sequence-diagram.component';
import { JobsService } from '../services';
import { InputService } from '../services/input.service';
import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

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
    protected datastore: Datastore,
    protected http: Http,
  ) {
    // Initialize operations
    this.editMessage();
    this.changeSendAndReceiveMessageEvents();
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

  /*
   * Change Send and receive Message Events
   * 
   * Ak pravým tlačítkom myši kliknem na lifeline point existujúcej
   * message a následne kliknem na iný lifeline point pravým tlačítkom,
   * mesage bude upravená.
   */
  protected changeSendAndReceiveMessageEvents() {
    let messageMove = false;
    let lifelineModel;
    let occurrenceSpecification;

    this.inputService.onRightClick((event) => {

      /*
      // Funguje iba v "edit" móde
      if (!this.menuComponent.editMode) return;
      */

      if (event.model.type == 'LifelinePoint') {
        if (messageMove) {
          /*
           * TODO: Manualna uprava JSON
           * 
           * Toto je nutné, pretože JSON API knižnica nepodporuje zmeny vzťahov modelov.
           * Preto vytvárame JSON ručne a posielaem ho na backend aby sme dokázali
           * zmeniť vzťahy modelov.
           */
          lifelineModel = this.datastore.peekRecord(M.Lifeline, event.model.lifelineID);
          let headers = new Headers({
            'Content-Type': 'application/vnd.api+json',
            'Accept': 'application/vnd.api+json'
          });

          let options = new RequestOptions({ headers: headers });
          let url = "/api/v1/occurrence-specifications/" + occurrenceSpecification.id;
          occurrenceSpecification.time = event.model.time;
          occurrenceSpecification.covered = lifelineModel;
          // Start job
          this.jobsService.start('changeSendAndReceiveMessageEvents');
          this.http.patch(url, {
            "data": {
              "type": "occurrence-specifications",
              "id": occurrenceSpecification.id.toString(),
              "relationships": {
                "covered": {
                  "data": {
                    "type": "lifelines",
                    "id": lifelineModel.id.toString()
                  }
                }
              }
            }
          }, options).subscribe(() => {
            this.sequenceDiagramComponent.refresh(() => {
              // Finish job
              this.jobsService.finish('changeSendAndReceiveMessageEvents');
            });
          });

          messageMove = false;
        }
        else {
          lifelineModel = this.datastore.peekRecord(M.Lifeline, event.model.lifelineID);
          // Prejdem occurrence specifications a zistim ci taky uz je t.j., ci uz na tom time je message
          for (let occurrence of lifelineModel.occurrenceSpecifications) {
            if (occurrence.time == event.model.time) {
              messageMove = true;
              // Tu mam occurrence z DB na ktorom je message
              occurrenceSpecification = this.datastore.peekRecord(M.OccurrenceSpecification, occurrence.id);
              break;
            }
          }
        }
      }
    });
  }

}