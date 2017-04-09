import { Datastore } from '../../datastore';
import { DialogService } from '../../dialog/services';
import { MenuComponent } from '../../menu/components/menu.component';
import { LifelineComponent } from '../components/lifeline.component';
import { MessageComponent } from '../components/message.component';
import { SequenceDiagramComponent } from '../components/sequence-diagram.component';
import * as M from '../models';
import { InputService } from './input.service';
import { JobsService } from './jobs.service';
import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

@Injectable()
export class SequenceDiagramService {

  /* Sequence Diagram Component Instance */
  public sequenceDiagramComponent: SequenceDiagramComponent = null;

  /* Menu Component Instance */
  public menuComponent: MenuComponent = null;

  public getSequenceDiagrams(): Observable<M.Interaction[]> {
    return this.datastore.query(M.InteractionFragment, {
      include: 'fragmentable',
      filter: {
        roots: 1
      }
    }).map(
      (fragments: M.InteractionFragment[]) => _.map(fragments, 'fragmentable')
      );
  }

  public loadSequenceDiagramTree(interaction: M.Interaction): Observable<M.InteractionFragment> {
    let id = interaction.fragment.id;

    return this.datastore.query(M.InteractionFragment, {
      include: _.join([
        'fragmentable.lifelines',
        'fragmentable.messages.sendEvent.covered',
        'fragmentable.messages.receiveEvent.covered',
        'fragmentable.start.covered',
        'fragmentable.finish.covered'
      ]),
      filter: {
        descendants: id
      }
    }).map(
      (fragments: M.InteractionFragment[]) => _.find(fragments, ['id', id])
      );
  }

  /////////////////////////////////////////
  /////////////////////////////////////////
  /////////////////////////////////////////

  protected static initialized = false;

  private layerForDelete;

  constructor(
    protected datastore: Datastore,
    protected inputService: InputService,
    protected dialogService: DialogService,
    protected http: Http,
    protected jobsService: JobsService
  ) {
    // Initialize the service
    if (!SequenceDiagramService.initialized) {
      this.initialize();
      SequenceDiagramService.initialized = true;
    }
  }

  /**
   * Select Operation
   */
  protected selectedElement = null;

  public initialize() {
    this.initializeDeleteOperation();
    this.initializeAddMessageOperation();
    this.initializeMoveLifeline();
    this.initializeVerticalMessageMove();
    this.initializeMoveMessageOperation();
  }


  /**
   * Create Operation
   */
  protected lifelineBefore: M.Lifeline;
  protected movingLifeline: M.Lifeline;
  protected addingLifelineEvent: Event;



  protected draggingLifeline: LifelineComponent = null;

  public initializeMoveLifeline() {
    let moveBool = false;
    this.inputService.onMouseDown((event) => {
      if (event.model.type == 'Lifeline') {
        this.draggingLifeline = event.model.component;
        this.movingLifeline = this.datastore.peekRecord(M.Lifeline, event.model.id);
        moveBool = true;
      }
    });
    this.inputService.onMouseMove((event) => {
      if (this.draggingLifeline && this.menuComponent.editMode.valueOf() == true)
        this.draggingLifeline.left = event.diagramX - 125;
    });
    this.inputService.onMouseUp((event) => {
      if (moveBool && this.movingLifeline != null) {
        if (!this.menuComponent.editMode) {
          this.movingLifeline = null;
          return;
        }
        moveBool = false;
        let interaction = this.movingLifeline.interaction;
        let lifelinesInInteraction = interaction.lifelines;
        let lifelineOrder = this.movingLifeline.order;
        let position = 0, count = 1;
        let orderBot = 0, orderTop = 125;
        let diagramX = 0;
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
        let numOfLifelines = lifelinesInInteraction.length;
        if (position > numOfLifelines) {
          position = numOfLifelines + 1;
        }
        if (position > this.movingLifeline.order && numOfLifelines > 2) {
          position--;
        }
        if (position == this.movingLifeline.order) {
          this.draggingLifeline.left = (position - 1) * 400;
          this.draggingLifeline = null;
          return;
        }
        this.draggingLifeline = null;
        let originalOrder = this.movingLifeline.order;
        for (let lifeline of lifelinesInInteraction) {
          if (lifeline.id == this.movingLifeline.id) {
            lifeline.order = position;
            lifeline.save().subscribe();
            continue;
          }
          else if (lifeline.order >= originalOrder && lifeline.order <= position) {
            lifeline.order--;
            lifeline.save().subscribe();
            continue;
          }
          else if (lifeline.order < originalOrder && lifeline.order >= position) {
            lifeline.order++;
            lifeline.save().subscribe();
            continue;
          }
        }
        this.sequenceDiagramComponent.refresh();
      }
    });
    this.movingLifeline = null;
    this.draggingLifeline = null;
  }

  /**
   * Delete Operation
   */

  protected performingDelete = false;

  public performDelete() {
    this.performingDelete = true;
  }

  protected initializeDeleteOperation() {
    let confirmDialog;

    this.inputService.onLeftClick((event) => {
      if (this.performingDelete) {
        switch (event.model.type) {

          case 'Message':
            let message = this.datastore.peekRecord(M.Message, event.model.id);
            confirmDialog = this.dialogService.createConfirmDialog("Delete message", "Do you really want to delete message \"" + message.name + "\" ?");

            confirmDialog.componentInstance.onYes.subscribe(result => {
              this.calculateTimeOnMessageDelete(message);
              this.datastore.deleteRecord(M.Message, message.id).subscribe(() => {
                this.sequenceDiagramComponent.refresh();
              });
              this.performingDelete = false;
            });
            confirmDialog.componentInstance.onNo.subscribe(result => {
              this.performingDelete = false;
            });
            event.stopPropagation();
            break;

          case 'Lifeline':
            let lifeline = this.datastore.peekRecord(M.Lifeline, event.model.id);
            confirmDialog = this.dialogService.createConfirmDialog("Delete lifeline", "Do you really want to delete lifeline \"" + lifeline.name + "\" ?");

            confirmDialog.componentInstance.onYes.subscribe(result => {
              this.calculateLifelinesOrder(lifeline);
              this.datastore.deleteRecord(M.Lifeline, lifeline.id).subscribe(() => {
                this.sequenceDiagramComponent.refresh();
              });
              this.performingDelete = false;
            });
            confirmDialog.componentInstance.onNo.subscribe(result => {
              this.performingDelete = false;
            });
            event.stopPropagation();
            break;
        }
      }
    });
  }

  /**
   * Funkcia upravuje atribut 'order' na Lifeline
   */
  protected calculateLifelinesOrder(lifeline: M.Lifeline) {

    let deletedLifelineOrder = lifeline.order;
    let interaction = lifeline.interaction;
    let lifelinesInInteraction = interaction.lifelines;

    // ak je order lifeliny vecsi ako order vymazanej lifeliny tak ho zmensim o 1
    for (let lifeline of lifelinesInInteraction) {
      if (lifeline.order > deletedLifelineOrder) {
        lifeline.order--;
        lifeline.save().subscribe();
      }
    }
  }
  protected layerInteraction(inputInteractionFragment: M.InteractionFragment) {

    let interactionFragment = inputInteractionFragment;

    if (interactionFragment.fragmentable.isLayerInteraction == null) {
      this.layerInteraction(interactionFragment.parent);
    } else if (interactionFragment.fragmentable.isLayerInteraction) {
      this.layerForDelete = interactionFragment.fragmentable;
    } else {
      this.layerInteraction(interactionFragment.parent);
    }
  }

  protected calculateTimeOnMessageDelete(message: M.Message) {

    let deletedMessageTime = message.sendEvent.time;
    this.layerInteraction(message.interaction.fragment);
    let layer = this.layerForDelete;
    let lifelinesInLayer = layer.lifelines;

    // prechadzam Occurence Spec. receive lifeliny a znizujem time o 1
    for (let lifeline of lifelinesInLayer) {
      for (let occurrence of lifeline.occurrenceSpecifications) {
        if (occurrence.time > deletedMessageTime) {
          // teraz to znizit o 1 treba, zober id occurence spec a znizit
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

  /**
   * Insert Operation
   */

  protected sourceLifelineEvent = null;
  protected destinationLifelineEvent = null;

  protected initializeAddMessageOperation() {
    this.inputService.onLeftClick((event) => {
      if (event.model.type == "LifelinePoint") {
        if (this.sourceLifelineEvent) {
          this.destinationLifelineEvent = event;
          if (this.sourceLifelineEvent.model.lifelineID == this.destinationLifelineEvent.model.lifelineID) {
            this.sourceLifelineEvent = this.destinationLifelineEvent;
          } else {
            this.createMessage(this.sourceLifelineEvent, this.destinationLifelineEvent, (message: M.Message) => {
              this.sequenceDiagramComponent.refresh();
            });
            this.sourceLifelineEvent = null;
            this.destinationLifelineEvent = null;
          }
        }
        else {
          this.sourceLifelineEvent = event;
        }
      }
    });
  }

  protected createMessage(sourceLifeline, destinationLifeline, callback: any) {
    let sourceLifelineModel = this.datastore.peekRecord(M.Lifeline, sourceLifeline.model.lifelineID);
    let destinationLifelineModel = this.datastore.peekRecord(M.Lifeline, destinationLifeline.model.lifelineID);
    let currentInteraction = this.datastore.peekRecord(M.Interaction, sourceLifelineModel.interaction.id);
    let time = Math.round(sourceLifeline.model.time);
    let maxTimeValue = 0;
    let messageName;

    //Najprv vypocitam ci su za nasou ktoru chcem pridat nejake message, ak ano, zmenim occurenci
    //Takto to funguje spravne
    //Najprv odskocia message a potom sa prida
    maxTimeValue = this.calculateTimeOnMessageInsert(currentInteraction, time, sourceLifelineModel, destinationLifelineModel);

    //Napad: Pridavat message vzdy najviac na vrch ako sa da, podla mna to sa tak ma aj v EAcku
    //Problem: Treba brat do uvahy comibed fragments a to je nejako vyriesit, keby vieme kolko occurence zabera
    //alebo podobne.
    /* if (maxTimeValue > 0){
      time = maxTimeValue + 1;
    }*/

    this.dialogService.createInputDialog("Creating message", "", "Enter message name").componentInstance.onOk.subscribe(result => {
      messageName = result;

      let sourceOccurence = this.datastore.createRecord(M.OccurrenceSpecification, {
        // TODO: konstantu 40 treba tahat z configu, aj 180 brat z configu
        time: time,
        covered: sourceLifelineModel
      });

      sourceOccurence.save().subscribe((sourceOccurence: M.OccurrenceSpecification) => {
        let destinationOccurence = this.datastore.createRecord(M.OccurrenceSpecification, {
          // TODO: konstantu 40 treba tahat z configu, aj 180 brat z configu
          time: time,
          covered: destinationLifelineModel
        });

        destinationOccurence.save().subscribe((destinationOccurence: M.OccurrenceSpecification) => {
          this.datastore.createRecord(M.Message, {
            // TODO nazvat message ako chcem
            name: result,
            sort: "synchCall",
            // TODO zmenit dynamicky na interaction / fragment v ktorom som
            interaction: this.datastore.peekRecord(M.Interaction, sourceLifelineModel.interaction.id),
            sendEvent: sourceOccurence,
            receiveEvent: destinationOccurence
          }).save().subscribe((message: M.Message) => {
            callback(message);
          });
        });
      });
    });
  }

  // TODO: pridavanie 3D sipky
  protected calculateTimeOnMessageInsert(currentInteraction: M.Interaction, time: number,
    sourceLifelineModel: M.Lifeline, destinationLifelineModel: M.Lifeline) {

    let move = false;
    let maxTimeValue = 0;
    let lifelinesInCurrentLayer = currentInteraction.lifelines;

    //Prechadzam vsetky lifeliny v aktualnom platne
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

    //Napad: ak sme nenasli taku messageu ze musime pod nou daco posuvat, tak nastavim maxTimeValue a dame ju navrch
    if (!move) {
      for (let lifeline of lifelinesInCurrentLayer) {
        for (let occurrence of lifeline.occurrenceSpecifications) {
          if (occurrence.time > maxTimeValue) {
            maxTimeValue = occurrence.time;
          }
        }
      }
    }

    //Prechadzam vsetky lifeliny v layeri a posuvam vsetky occurenci o jedno dalej
    if (move) {
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

  /**
   * Update Operation
   */
  protected draggingMessage: MessageComponent = null;
  public initializeVerticalMessageMove() {
    this.inputService.onMouseDown((event) => {
      if (event.model.type == "Message") {
        this.draggingMessage = event.model.component;
      }
    });

    this.inputService.onMouseMove((event) => {
      if (this.draggingMessage) {
        this.draggingMessage.top = event.offsetY - 80;
      }
    });

    this.inputService.onMouseUp((event) => {
      if (this.draggingMessage) {
        // TODO: Pouzit z configu nie iba /40.0
        this.draggingMessage.messageModel.sendEvent.time = Math.round((event.offsetY - 110) / 40.0);
        this.draggingMessage.messageModel.receiveEvent.time = Math.round((event.offsetY - 110) / 40.0);
        this.draggingMessage.messageModel.sendEvent.save().subscribe(() => { });
        this.draggingMessage.messageModel.receiveEvent.save().subscribe(() => { });
        this.calculateTimeOnMessageUpdate(this.draggingMessage.messageModel.sendEvent.covered.interaction,
          this.draggingMessage.messageModel.sendEvent, this.draggingMessage.messageModel.receiveEvent);
        this.draggingMessage.top = null;
        this.draggingMessage = null;
      }
    });
  }
  protected calculateTimeOnMessageUpdate(currentInteraction: M.Interaction,
    sourceOccurence: M.OccurrenceSpecification, destinationOccurence: M.OccurrenceSpecification) {

    let move = false;
    let maxTimeValue = 0;
    let lifelinesInCurrentLayer = currentInteraction.lifelines;
    let time = sourceOccurence.time;

    //Prechadzam vsetky lifeliny v aktualnom platne
    for (let lifeline of lifelinesInCurrentLayer) {
      for (let occurrence of lifeline.occurrenceSpecifications) {
        if (occurrence.time == time &&
          ((sourceOccurence.id != occurrence.id) && (destinationOccurence.id != occurrence.id))) {
          move = true;
          break;
        }
        if (move) {
          break;
        }
      }
    }
    // Prechadzam vsetky lifeliny v layeri a posuvam vsetky occurenci o jedno dalej
    if (move) {
      for (let lifeline of lifelinesInCurrentLayer) {
        for (let occurrence of lifeline.occurrenceSpecifications) {
          if (occurrence.time >= time &&
            ((sourceOccurence.id != occurrence.id) && (destinationOccurence.id != occurrence.id))) {
            let occurenceForChange = this.datastore.peekRecord(M.OccurrenceSpecification, occurrence.id);
            occurenceForChange.time = occurenceForChange.time + 1;
            occurenceForChange.save().subscribe();
          }
        }
      }
    }
  }

  protected initializeMoveMessageOperation() {
    let messageMove = false;
    let lifelineModel;
    let occurrenceSpecification;

    this.inputService.onRightClick((event) => {
      if (event.model.type == "LifelinePoint") {
        if (messageMove) {
          lifelineModel = this.datastore.peekRecord(M.Lifeline, event.model.lifelineID);

          // Manualna uprava JSON
          let headers = new Headers({
            'Content-Type': 'application/vnd.api+json',
            'Accept': 'application/vnd.api+json'
          });

          let options = new RequestOptions({ headers: headers });
          let url = "/api/v1/occurrence-specifications/" + occurrenceSpecification.id;
          occurrenceSpecification.time = event.model.time;
          occurrenceSpecification.covered = lifelineModel;
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
            this.sequenceDiagramComponent.refresh();
          });

          messageMove = false;
        }
        else {
          lifelineModel = this.datastore.peekRecord(M.Lifeline, event.model.lifelineID);
          //prejdem occurrence specifications a zistim ci taky uz je t.j., ci uz na tom time je message
          for (let occurrence of lifelineModel.occurrenceSpecifications) {
            if (occurrence.time == event.model.time) {
              messageMove = true;
              //tu mam occurrence z DB na ktorom je message
              occurrenceSpecification = this.datastore.peekRecord(M.OccurrenceSpecification, occurrence.id);
              break;
            }
          }
        }
      }
    });
  }
}