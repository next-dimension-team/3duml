import { Datastore } from '../../datastore';
import { DialogService } from '../../dialog/services';
import { MenuComponent } from '../../menu/components/menu.component';
import * as M from '../../sequence-diagram/models';
import { MessageComponent } from '../components/message.component';
import { SequenceDiagramComponent } from '../components/sequence-diagram.component';
import { JobsService } from '../services';
import { InputService } from '../services/input.service';
import { SequenceDiagramController } from './sequence-diagram.controller';
import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

@Injectable()
export class MessagesController {

  /* Sequence Diagram Component Instance */
  public sequenceDiagramComponent: SequenceDiagramComponent = null;

  /* Sequence Diagram Controller Instance */
  public sequenceDiagramController: SequenceDiagramController = null;

  /* Menu Component Instance */
  public menuComponent: MenuComponent = null;

  public lastMessage = false;

  constructor(
    protected dialogService: DialogService,
    protected jobsService: JobsService,
    protected inputService: InputService,
    protected datastore: Datastore,
    protected http: Http,
  ) {
    // Initialize operations
    this.editMessage();
    this.createMessageOnLifelinePointClick();
    this.changeSendAndReceiveMessageEvents();
    this.verticalMessageMove();
  }

  /*
   * Create Message
   */
  protected createMessageOnLifelinePointClick() {
    let sourceLifelineEvent = null;
    let destinationLifelineEvent = null;

    this.inputService.onLeftClick((event) => {
      if (event.model.type == 'LifelinePoint') {
        if (sourceLifelineEvent) {
          destinationLifelineEvent = event;
          if (sourceLifelineEvent.model.lifelineID == destinationLifelineEvent.model.lifelineID) {
            sourceLifelineEvent = destinationLifelineEvent;
          } else {
            this._createMessage(sourceLifelineEvent, destinationLifelineEvent);
            sourceLifelineEvent = null;
            destinationLifelineEvent = null;
          }
        }
        else {
          sourceLifelineEvent = event;
        }
      }
    });
  }

  /*
   * Pomocná metóda
   * 
   * TODO: napisat komentar co tato metoda robi
   */
  protected _createMessage(sourceLifeline, destinationLifeline) {
    let sourceLifelineModel = this.datastore.peekRecord(M.Lifeline, sourceLifeline.model.lifelineID);
    let destinationLifelineModel = this.datastore.peekRecord(M.Lifeline, destinationLifeline.model.lifelineID);
    let currentInteraction = this.datastore.peekRecord(M.Interaction, sourceLifelineModel.interaction.id);
    let time = Math.round(sourceLifeline.model.time);
    let maxTimeValue = 0;
    let messageName;
    let messageSort;

    // Najprv vypocitam ci su za nasou ktoru chcem pridat nejake message, ak ano, zmenim occurenci
    // Takto to funguje spravne
    // Najprv odskocia message a potom sa prida
    maxTimeValue = this._calculateTimeOnMessageCreate(currentInteraction, time, sourceLifelineModel, destinationLifelineModel);

    // Napad: Pridavat message vzdy najviac na vrch ako sa da, podla mna to sa tak ma aj v EAcku
    // Problem: Treba brat do uvahy comibed fragments a to je nejako vyriesit, keby vieme kolko occurence zabera
    // alebo podobne.
    /* if (maxTimeValue > 0){
      time = maxTimeValue + 1;
    }*/

    // Ak mame v layeri na posledom mieste message, nedovolime pridat.
    if (this.lastMessage) {
      this.dialogService.createConfirmDialog(
        "Error", "Cannot create message, because you have the last message. " +
        "Please move the last message on layer elsewhere or delete it \"").componentInstance.onYes.subscribe(result => { });
    } else {
      this.dialogService.createEditDialog(
        "Creating message", "", "Enter message name", "message").componentInstance.onOk.subscribe((result) => {
          messageName = result.name;
          messageSort = result.messageSort;

          let sourceOccurence = this.datastore.createRecord(M.OccurrenceSpecification, {
            time: time,
            covered: sourceLifelineModel
          });

          // Start job
          this.jobsService.start('_createMessage');

          sourceOccurence.save().subscribe((sourceOccurence: M.OccurrenceSpecification) => {
            let destinationOccurence = this.datastore.createRecord(M.OccurrenceSpecification, {
              time: time,
              covered: destinationLifelineModel
            });

            destinationOccurence.save().subscribe((destinationOccurence: M.OccurrenceSpecification) => {
              this.datastore.createRecord(M.Message, {
                name: messageName,
                sort: messageSort,
                // TODO zmenit dynamicky na interaction / fragment v ktorom som
                interaction: this.datastore.peekRecord(M.Interaction, sourceLifelineModel.interaction.id),
                sendEvent: sourceOccurence,
                receiveEvent: destinationOccurence
              }).save().subscribe((message: M.Message) => {
                this.sequenceDiagramComponent.refresh(() => {
                  // Finish job
                  this.jobsService.finish('_createMessage');
                });
              });
            });
          });
        });
    }
  }

  /*
   * Pomocná metóda
   * 
   * Vypocita, kam treba odskocit. V pripade, ze mame v layeri last message, tak nemozeme pridat message.
   */
  protected _calculateTimeOnMessageCreate(currentInteraction: M.Interaction, time: number,
    sourceLifelineModel: M.Lifeline, destinationLifelineModel: M.Lifeline) {

    this.lastMessage = false;
    let move = false;
    let maxTimeValue = 0;
    let lifelinesInCurrentLayer = currentInteraction.lifelines;

    // Zistime pri pridavani, ci mame poslednu message v layeri
    for (let lifeline of lifelinesInCurrentLayer) {
      for (let occurrence of lifeline.occurrenceSpecifications) {
        if (occurrence.time >= 20) {
          this.lastMessage = true;
        }
      }
    }

    // Prechadzam vsetky lifeliny v aktualnom platne
    for (let lifeline of lifelinesInCurrentLayer) {
      for (let occurrence of lifeline.occurrenceSpecifications) {
        if (occurrence.time == time) {
          move = true;
          break;
        }
        if (move) {
          break;
        }
      }
    }

    // Napad: ak sme nenasli taku messageu ze musime pod nou daco posuvat, tak nastavim maxTimeValue a dame ju navrch
    if (!move) {
      // Mozme vytvorit message, lebo neposkakujeme
      this.lastMessage = false;
      for (let lifeline of lifelinesInCurrentLayer) {
        for (let occurrence of lifeline.occurrenceSpecifications) {
          if (occurrence.time > maxTimeValue) {
            maxTimeValue = occurrence.time;
          }
        }
      }
    }

    // Prechadzam vsetky lifeliny v layeri a posuvam vsetky occurenci o jedno dalej
    if (move && !this.lastMessage) {
      for (let lifeline of lifelinesInCurrentLayer) {
        for (let occurrence of lifeline.occurrenceSpecifications) {
          if (occurrence.time >= time) {
            let occurenceForChange = this.datastore.peekRecord(M.OccurrenceSpecification, occurrence.id);
            occurenceForChange.time = occurenceForChange.time + 1;
            occurenceForChange.save().subscribe();
          }
        }
      }
    }

    return maxTimeValue;
  }

  /*
   * Edit Message
   */
  protected editMessage() {
    this.inputService.onDoubleClick((event) => {
      // Did we double-clicked on lifeline in edit mode ?
      if (this.menuComponent.editMode && !this.sequenceDiagramController.deleteInProgress && event.model.type == 'Message') {
        // Get lifeline model
        let message = this.datastore.peekRecord(M.Message, event.model.id);
        // Open dialog
        this.dialogService.createEditDialog("Edit message", message, "Enter message name", "message").componentInstance.onOk.subscribe((result) => {
          // Start job
          this.jobsService.start('renameMessage');
          // Rename lifeline
          message.name = result.name;
          message.sort = result.messageSort;
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

  /*
   * Vertical Message Move
   */
  public verticalMessageMove() {
    let draggingMessage: MessageComponent = null;

    this.inputService.onMouseDown((event) => {
      if (this.menuComponent.editMode && !this.sequenceDiagramController.deleteInProgress && event.model.type == 'Message') {
        draggingMessage = event.model.component;
      }
    });

    this.inputService.onMouseMove((event) => {
      if (this.menuComponent.editMode && !this.sequenceDiagramController.deleteInProgress && draggingMessage) {
        draggingMessage.top = event.diagramY - 80;
      }
    });

    this.inputService.onMouseUp((event) => {
      if (this.menuComponent.editMode && !this.sequenceDiagramController.deleteInProgress && draggingMessage) {

        let originalSendEventTime = draggingMessage.messageModel.sendEvent.time;
        let originalReceiveEventTime = draggingMessage.messageModel.receiveEvent.time;

        // TODO: Pouzit z configu nie iba /40.0
        draggingMessage.messageModel.sendEvent.time = Math.round((event.diagramY - 110) / 40.0);
        draggingMessage.messageModel.receiveEvent.time = Math.round((event.diagramY - 110) / 40.0);

        // Zmenili sme niečo ?
        let changed = (
          draggingMessage.messageModel.sendEvent.time != originalSendEventTime ||
          draggingMessage.messageModel.receiveEvent.time != originalReceiveEventTime
        );

        // Move send event
        if (changed) {
          this.jobsService.start('verticalMessageMove.sendEvent');
          //Ak posunieme message dalej ako je polovica hlavicky lifeline
          //tak skoci na svoje predosle miesto, ak tesne nad prvu message tak sa vymenia 
          if (draggingMessage.messageModel.sendEvent.time < 1 && draggingMessage.messageModel.sendEvent.time > -1) {
            draggingMessage.messageModel.sendEvent.time = 1;
          } else if (draggingMessage.messageModel.sendEvent.time <= -1) {
            draggingMessage.messageModel.sendEvent.time = originalSendEventTime;
          } else if (draggingMessage.messageModel.sendEvent.time == 20) {
            draggingMessage.messageModel.sendEvent.time = 20;
          } else if (draggingMessage.messageModel.sendEvent.time >= 21) {
            draggingMessage.messageModel.sendEvent.time = originalSendEventTime;
          }
          draggingMessage.messageModel.sendEvent.save().subscribe(() => {
            this.jobsService.finish('verticalMessageMove.sendEvent');
          });
        }

        // Move receive event
        if (changed) {
          this.jobsService.start('verticalMessageMove.receiveEvent');
          //Ak posunieme message dalej ako je polovica hlavicky lifeline
          //tak skoci na svoje predosle miesto, ak tesne nad prvu message tak sa vymenia  
          if (draggingMessage.messageModel.receiveEvent.time < 1 &&
            draggingMessage.messageModel.receiveEvent.time > -1) {
            draggingMessage.messageModel.receiveEvent.time = 1;
          } else if (draggingMessage.messageModel.receiveEvent.time <= -1) {
            draggingMessage.messageModel.receiveEvent.time = originalReceiveEventTime;
          } else if (draggingMessage.messageModel.receiveEvent.time == 20) {
            draggingMessage.messageModel.receiveEvent.time = 20;
          } else if (draggingMessage.messageModel.receiveEvent.time >= 21) {
            draggingMessage.messageModel.receiveEvent.time = originalReceiveEventTime;
          }
          draggingMessage.messageModel.receiveEvent.save().subscribe(() => {
            this.jobsService.finish('verticalMessageMove.receiveEvent');
          });
        }

        this._calculateTimeOnMessageUpdate(draggingMessage.messageModel.sendEvent.covered.interaction,
          draggingMessage.messageModel.sendEvent, draggingMessage.messageModel.receiveEvent, originalSendEventTime);

        draggingMessage.top = null;
        draggingMessage = null;
      }
    });
  }

  /*
   * Pomocná metóda
   * 
   * Poskakovanie message-ov pri tom, ak pohybujem message vertikalne.
   */
  protected _calculateTimeOnMessageUpdate(currentInteraction: M.Interaction,
    sourceOccurence: M.OccurrenceSpecification, destinationOccurence: M.OccurrenceSpecification,
    originalSendEventTime: any) {

    this.lastMessage = false;
    let move = false;
    let maxTimeValue = 0;
    let lifelinesInCurrentLayer = currentInteraction.lifelines;
    let time = sourceOccurence.time;

    // Prechadzam vsetky lifeliny v aktualnom platne a hladam poslednu message
    for (let lifeline of lifelinesInCurrentLayer) {
      for (let occurrence of lifeline.occurrenceSpecifications) {
        if (occurrence.time == time &&
          ((sourceOccurence.id != occurrence.id) && (destinationOccurence.id != occurrence.id))) {
          move = true;
        }
        // Najdeme ci mame poslednu message v layeri
        if (occurrence.time >= 20 &&
          ((sourceOccurence.id != occurrence.id) && (destinationOccurence.id != occurrence.id))) {
          this.lastMessage = true;
        }
      }
    }

    // Ak mame poslednu message a treba poskakovat, tak v tom pripade sa budu iba dve message vymienat vzajomne
    // a nie poskakovat vsetky :)
    if (this.lastMessage && move) {
      for (let lifeline of lifelinesInCurrentLayer) {
        for (let occurrence of lifeline.occurrenceSpecifications) {
          if (occurrence.time == time &&
            ((sourceOccurence.id != occurrence.id) && (destinationOccurence.id != occurrence.id))) {
            let occurenceForChange = this.datastore.peekRecord(M.OccurrenceSpecification, occurrence.id);
            occurenceForChange.time = originalSendEventTime;

            // Start job
            this.jobsService.start('verticalMessageMove.calculateTimeOnMessageUpdate.' + occurenceForChange.id);
            occurenceForChange.save().subscribe(() => {
              // Finish job
              this.jobsService.finish('verticalMessageMove.calculateTimeOnMessageUpdate.' + occurenceForChange.id);
            });
            break;
          }
        }
      }
    }

    // Prechadzam vsetky lifeliny v layeri a posuvam vsetky occurenci o jedno dalej, ak nemame poslednu message
    if (move && !this.lastMessage) {
      for (let lifeline of lifelinesInCurrentLayer) {
        for (let occurrence of lifeline.occurrenceSpecifications) {
          if (occurrence.time >= time &&
            ((sourceOccurence.id != occurrence.id) && (destinationOccurence.id != occurrence.id))) {
            let occurenceForChange = this.datastore.peekRecord(M.OccurrenceSpecification, occurrence.id);
            occurenceForChange.time = occurenceForChange.time + 1;

            // Start job
            this.jobsService.start('verticalMessageMove.calculateTimeOnMessageUpdate.' + occurenceForChange.id);
            occurenceForChange.save().subscribe(() => {
              // Finish job
              this.jobsService.finish('verticalMessageMove.calculateTimeOnMessageUpdate.' + occurenceForChange.id);
            });
          }
        }
      }
    }
  }

  /*
   * Delete message
   */
  public deleteMessage(message: M.Message): void {
    this.dialogService.createConfirmDialog(
      "Delete message", "Do you really want to delete message \"" + message.name + "\" ?").componentInstance.onYes.subscribe(result => {
        this._calculateTimeOnMessageDelete(message);
        this.datastore.deleteRecord(M.Message, message.id).subscribe(() => {
          this.sequenceDiagramComponent.refresh();
        });
      });
  }

  /*
   * Pomocná metóda
   * 
   * TODO: napisat komentar co tato metoda robi
   */
  protected getRecursivelyLayerInteraction(inputInteractionFragment: M.InteractionFragment) {
    let interactionFragment = inputInteractionFragment;

    if (interactionFragment.fragmentable.isLayerInteraction == null) {
      return this.getRecursivelyLayerInteraction(interactionFragment.parent);
    } else if (interactionFragment.fragmentable.isLayerInteraction) {
      return interactionFragment.fragmentable;
    } else {
      return this.getRecursivelyLayerInteraction(interactionFragment.parent);
    }
  }

  /*
   * Pomocná metóda
   * 
   * TODO: napisat komentar co tato metoda robi
   */
  protected _calculateTimeOnMessageDelete(message: M.Message) {

    let deletedMessageTime = message.sendEvent.time;
    let layer = this.getRecursivelyLayerInteraction(message.interaction.fragment);
    let lifelinesInLayer = layer.lifelines;

    // Prechadzam Occurence Spec. receive lifeliny a znizujem time o 1
    for (let lifeline of lifelinesInLayer) {
      for (let occurrence of lifeline.occurrenceSpecifications) {
        if (occurrence.time > deletedMessageTime) {
          // Teraz to znizit o 1 treba, zober id occurence spec a znizit
          this.datastore.findRecord(M.OccurrenceSpecification, occurrence.id).subscribe(
            (occurrenceSpecification: M.OccurrenceSpecification) => {
              occurrenceSpecification.time = occurrenceSpecification.time - 1;
              occurrenceSpecification.save().subscribe();
            }
          );
        }
      }
    }
  }

}