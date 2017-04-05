import { Injectable } from '@angular/core';
import { Datastore } from '../../datastore';
import { JsonApiModel, ModelType } from 'angular2-jsonapi';
import { Observable, BehaviorSubject } from 'rxjs';
import { InputService } from './input.service';
import { InputDialogComponent } from './input-dialog.component';
import { LifelineComponent } from '../components/lifeline.component';
import { MessageComponent } from '../components/message.component';
import { SequenceDiagramComponent } from '../components/sequence-diagram.component';
import { Headers, RequestOptions, Http } from '@angular/http';
import * as _ from 'lodash';
import * as M from '../models';

@Injectable()
export class SequenceDiagramService {

  protected static initialized = false;

  public editingLayer: M.InteractionFragment = null;
  private menuReloadSource = new BehaviorSubject<any>(null);
  public menuReload$ = this.menuReloadSource.asObservable();
  private layerForDelete;

  /* Getter & Setter for Sequence Diagram Component Instance */
  protected _sequenceDiagramComponent: SequenceDiagramComponent = null;

  public set sequenceDiagramComponent(sequenceDiagramComponent: SequenceDiagramComponent) {
    this._sequenceDiagramComponent = sequenceDiagramComponent;
  }

  public get sequenceDiagramComponent() {
    return this._sequenceDiagramComponent;
  }

  protected waitingCursor(state: boolean) {
    if (state) {
      document.body.className = 'loading';
    } else {
      document.body.className = '';
    }
  }

  public refresh() {
    this.waitingCursor(true);
    this.loadSequenceDiagramTree(this.sequenceDiagramComponent.rootInteractionFragment.fragmentable)
      .subscribe((interactionFragment: M.InteractionFragment) => {
        this.sequenceDiagramComponent.rootInteractionFragment = interactionFragment
        this.waitingCursor(false);
      });
  }

  constructor(protected datastore: Datastore, protected inputService: InputService, protected http: Http) {
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
  private editMode: Boolean = false;

  public initialize() {
    this.initializeDeleteOperation();
    this.initializeAddMessageOperation();
    this.initializeAddLifeline();
    this.initializeRenameElement();
    this.moveLifeline();
    this.initializeVerticalMessageMove();
    this.initializeEditLayerAfterDoubleClick();
    this.initializeMoveMessageOperation();
  }

  /**
   * Retrieve Operation
   */
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

  /**
   * Create Operation
   */
  public createDiagram(name: string) {
    let interaction = this.datastore.createRecord(M.Interaction, {
      name: name
    });

    interaction.save().subscribe((interaction: M.Interaction) => {
      let interactionFragment = this.datastore.createRecord(M.InteractionFragment, {
        fragmentable: interaction
      });
      interactionFragment.save().subscribe();

      this.menuReloadSource.next(null);
    });
  }

  protected lifelineBefore: M.Lifeline;
  protected selectedLifeline: M.Lifeline;
  protected layer: M.Interaction;
  protected savedEvent: Event;

  public initializeAddLifeline() {
    this.inputService.onLeftClick((event) => {
      console.log(event);
      if (event.model.type == "Layer") {
        this.layer = this.datastore.peekRecord(M.Interaction, event.model.id);
        this.savedEvent = event;
      } /*else
      if (event.model.type == "Lifeline") {
        this.lifelineBefore = this.datastore.peekRecord(M.Lifeline, event.model.id);
        this.layer = null;
        //event.stopPropagation();
      } */
      //console.log(this.lifelineBefore);
      //console.log(this.layer);
    });
  }

  public setEditMode(type: Boolean) {
    this.editMode = type;
  }

  protected draggingLifeline: LifelineComponent = null;
  public moveLifeline() {
    let moveBool = false;
    this.inputService.onMouseDown((event) => {
      if (event.model.type == 'Lifeline') {
        this.draggingLifeline = event.model.component;
        //     console.log(this.draggingLifeline);
        this.selectedLifeline = this.datastore.peekRecord(M.Lifeline, event.model.id);
        moveBool = true;
      }
    });
    this.inputService.onMouseMove((event) => {
      if (this.draggingLifeline && this.editMode.valueOf() == true)
        this.draggingLifeline.left = event.offsetX - 436 - 75;
    });
    this.inputService.onMouseUp((event) => {
      if (moveBool && this.selectedLifeline != null) {
        if (this.editMode == false) {
          this.selectedLifeline = null;
          return;
        }
        moveBool = false;
        let interaction = this.selectedLifeline.interaction;
        let lifelinesInInteraction = interaction.lifelines;
        let lifelineOrder = this.selectedLifeline.order;
        let position = 0, count = 1;
        let orderBot = 0, orderTop = 518;
        let offsetX = 0;
        while (position == 0) {
          if (event.offsetX < orderTop && event.offsetX > orderBot) {
            position = count;
            offsetX = orderTop;
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
        if (position > this.selectedLifeline.order && numOfLifelines > 2) {
          position--;
        }
        if (position == this.selectedLifeline.order) {
          this.draggingLifeline.left = (position - 1) * 400;
          this.draggingLifeline = null;
          return;
        }
        let originalOrder = this.selectedLifeline.order;
        for (let lifeline of lifelinesInInteraction) {
          if (lifeline.id == this.selectedLifeline.id) {
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
        this.refresh();
      }
    });
    this.selectedLifeline = null;
    this.draggingLifeline = null;
  }

  public createLifeline(name: string, callback: any) {
    let lifelinesInInteraction = this.layer.lifelines;
    // let lifelineOrder = this.selectedLifeline.order;
    let position = 0, count = 1;
    let orderBot = 0, orderTop = 518;
    let offsetX = 0;
    while (position == 0) {
      if (this.savedEvent.offsetX < orderTop && this.savedEvent.offsetX > orderBot) {
        position = count;
        offsetX = orderTop;
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
    console.log(position);
    for (let lifeline of lifelinesInInteraction) {
      if (lifeline.order >= position) {
        lifeline.order++;
        lifeline.save().subscribe();
      }
    }
    let lifelineNew = this.datastore.createRecord(M.Lifeline, {
      name: name,
      order: position,
      interaction: this.layer
    });
    lifelineNew.save().subscribe(() => {
      this.lifelineBefore = null;
      this.layer = null;
      this.refresh();
    });

    // console.log(this.layer);
    /*    if (this.lifelineBefore) {
          let interaction = this.lifelineBefore.interaction;
          let lifelinesInInteraction = interaction.lifelines;
          let newLifineOrder = this.lifelineBefore.order;
          for (let lifeline of lifelinesInInteraction) {
            if (lifeline.order > newLifineOrder) {
              lifeline.order++;
              lifeline.save().subscribe();
            }
          }
          let lifelineNew = this.datastore.createRecord(M.Lifeline, {
            name: name,
            order: newLifineOrder + 1,
            interaction: interaction
          });
          lifelineNew.save().subscribe(() => {
            this.lifelineBefore = null;
            this.layer = null;
            this.refresh();
          });
        }
        else if (this.layer) {
          let lifelinesInInteraction = this.layer.lifelines;
          let newLifineOrder = 0;
          for (let lifeline of lifelinesInInteraction) {
            if (lifeline.order > newLifineOrder) {
              lifeline.order++;
              lifeline.save().subscribe();
            }
          }
          let lifeline = this.datastore.createRecord(M.Lifeline, {
            name: name,
            //TODO dorobit podla offesetX
            order: 1,
            interaction: this.layer
          });
          lifeline.save().subscribe(() => {
            this.lifelineBefore = null;
            this.layer = null;
            this.refresh();
          });
        } */
  }

  public createLayer(name: string, openedSequenceDiagram: M.InteractionFragment) {

    let layer = this.datastore.createRecord(M.Interaction, {
      name: name
    });

    layer.save().subscribe((layer: M.Interaction) => {
      let interactionFragment = this.datastore.createRecord(M.InteractionFragment, {
        fragmentable: layer,
        parent: openedSequenceDiagram
      });
      interactionFragment.save().subscribe(() => {
        this.refresh();
      });
    });
  }

  /**
   * Rename Operation
   */
  protected renamingLayer = false;

  public renameDiagram(sequenceDiagram: M.Interaction){

    let editDialog;
    editDialog = this.inputService.createEditDialog("Edit Diagram", sequenceDiagram.name, "Enter Diagram name");
    editDialog.componentInstance.onOk.subscribe(result => {
      sequenceDiagram.name = result;
      sequenceDiagram.save().subscribe();
    });  
  }

  public renameLayer(interactionFragment: M.InteractionFragment){

    let editDialog;
    
    let layer = this.datastore.peekRecord(M.Interaction, interactionFragment.fragmentable.id);
    editDialog = this.inputService.createEditDialog("Edit layer", layer.name, "Enter Layer name");
    editDialog.componentInstance.onOk.subscribe(result => {
      layer.name = result;
      layer.save().subscribe();
    });  
  }

  protected initializeRenameElement(){

    let editDialog;

    this.inputService.onDoubleClick((event) => {
      switch (event.model.type) {
        case 'Message':
          let message = this.datastore.peekRecord(M.Message, event.model.id);
          editDialog = this.inputService.createEditDialog("Edit message", message.name, "Enter message name");
          editDialog.componentInstance.onOk.subscribe(result => {
            message.name = result;
            message.save().subscribe();
          });  
        break;
        case 'Lifeline':
          let lifeline = this.datastore.peekRecord(M.Lifeline, event.model.id);
          editDialog = this.inputService.createEditDialog("Edit lifeline", lifeline.name, "Enter lifeline name");
          editDialog.componentInstance.onOk.subscribe(result => {
            lifeline.name = result;
            lifeline.save().subscribe();
          });  
        break;
      }
    });
  }

  /**
   * Delete Operation
   */

  protected performingDelete = false;

  public performDelete() {
    this.performingDelete = true;
  }

  public deleteDiagram(sequenceDiagram: M.Interaction) {
    this.datastore.deleteRecord(M.InteractionFragment, sequenceDiagram.fragment.id).subscribe();
    this.menuReloadSource.next(null);
  }

  public deleteLayer() {
    let confirmDialog = this.inputService.createConfirmDialog("Delete layer", "Do you really want to delete layer \"" + this.editingLayer.fragmentable.name + "\" ?");
    confirmDialog.componentInstance.onYes.subscribe(result => {
      this.datastore.deleteRecord(M.InteractionFragment, this.editingLayer.id).subscribe(() => {
        this.refresh();
      });
    });
  }

  protected initializeDeleteOperation() {
    let confirmDialog;

    this.inputService.onLeftClick((event) => {
      if (this.performingDelete) {
        switch (event.model.type) {

          case 'Message':
            let message = this.datastore.peekRecord(M.Message, event.model.id);
            confirmDialog = this.inputService.createConfirmDialog("Delete message", "Do you really want to delete message \"" + message.name + "\" ?");

            confirmDialog.componentInstance.onYes.subscribe(result => {
              this.calculateTimeOnMessageDelete(message);
              this.datastore.deleteRecord(M.Message, message.id).subscribe(() => {
                this.refresh();
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
            confirmDialog = this.inputService.createConfirmDialog("Delete lifeline", "Do you really want to delete lifeline \"" + lifeline.name + "\" ?");

            confirmDialog.componentInstance.onYes.subscribe(result => {
              this.calculateLifelinesOrder(lifeline);
              this.datastore.deleteRecord(M.Lifeline, lifeline.id).subscribe(() => {
                this.refresh();
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
              this.refresh();
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

  protected createMessage(sourceLifeline: MouseEvent, destinationLifeline: MouseEvent, callback: any) {
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

    this.inputService.createInputDialog("Creating message", "", "Enter message name").componentInstance.onOk.subscribe(result => {
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
        this.draggingMessage.top = event.offsetY - 50;
      }
    });

    this.inputService.onMouseUp((event) => {
      if (this.draggingMessage && event.model.type == "Message") {
        // TODO: Pouzit z configu nie iba /40.0
        this.draggingMessage.messageModel.sendEvent.time = Math.round((event.offsetY - 80) / 40.0);
        this.draggingMessage.messageModel.receiveEvent.time = Math.round((event.offsetY - 80) / 40.0);
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

  protected initializeEditLayerAfterDoubleClick() {
    this.inputService.onDoubleClick((event) => {
      if (event.model.type == 'Layer') {
        this.sequenceDiagramComponent.editLayer(event.model.component.interactionFragmentModel);
        // Open edit mode
        var e = document.createEvent('MouseEvents');
        e.initEvent('click', true, true); // All events created as bubbling and cancelable.
        e.synthetic = true; // allow detection of synthetic events
        // The second parameter says go ahead with the default action
        document.getElementById('md-tab-label-0-1').dispatchEvent(e, true);
      }
    });
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
            this.refresh();
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