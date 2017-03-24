import { Injectable } from '@angular/core';
import { Datastore } from '../../datastore';
import { JsonApiModel, ModelType } from 'angular2-jsonapi';
import { Observable } from 'rxjs';
import { InputService } from './input.service';
import { InputDialogComponent } from './input-dialog.component';
import { MessageComponent } from '../components/message.component';
import * as _ from 'lodash';
import * as M from '../models';

@Injectable()
export class SequenceDiagramService {

  protected static initialized = false;

  constructor(protected datastore: Datastore, protected inputService: InputService) {
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
    this.initializeAddLifeline();
    this.initializeVerticalMessageMove();
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
    });
  }

  protected lifelineBefore: M.Lifeline;
  protected layer: M.Interaction;

  public initializeAddLifeline() {
    this.inputService.onLeftClick((event) => {
      if (event.model.type == "Lifeline") {
        this.lifelineBefore = this.datastore.peekRecord(M.Lifeline, event.model.id);
      }
      if (event.model.type == "Layer") {
        this.layer = this.datastore.peekRecord(M.Interaction, event.model.id);
      }
    });
  }

  public createLifeline(name: string, callback: any) {
    if (this.lifelineBefore) {
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
        location.reload();
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
        //TODO dorobit podla offsetX
        order: 1,
        interaction: this.layer
      });
      lifeline.save().subscribe(() => {
        this.lifelineBefore = null;
        this.layer = null;
        location.reload();
      });
    }
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
        location.reload();
      });
    });
  }

  /**
   * Update Operation
   */

  // TODO: dorobit upratovanie messagov
  protected draggingMessage: MessageComponent = null;
  public initializeVerticalMessageMove() {
    this.inputService.onMouseDown((event) => {
      if (event.model.type == "Message") {
        this.draggingMessage = event.model.component;
        console.log(this.draggingMessage);
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
        console.log(event.offsetY);
        console.log(Math.round((event.offsetY - 50) / 40.0));
        this.draggingMessage.messageModel.sendEvent.time = Math.round((event.offsetY - 80) / 40.0);
        this.draggingMessage.messageModel.receiveEvent.time = Math.round((event.offsetY - 80) / 40.0);
        this.calculateTimeOnMessageUpdate(
          this.draggingMessage.messageModel.sendEvent.covered.interaction,
          this.draggingMessage.messageModel.sendEvent.time,
          this.draggingMessage.messageModel.sendEvent.covered,
          this.draggingMessage.messageModel.receiveEvent.covered,
        );
        this.draggingMessage.messageModel.sendEvent.save().subscribe(() => { });
        this.draggingMessage.messageModel.receiveEvent.save().subscribe(() => {
          this.draggingMessage = null;
          //location.reload();
        });
        this.draggingMessage.top = null;
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

  /**
   * Funkcia maze iba z tabulky Interaction Fragment 
   * na backende sa dorobi automaticke mazanie morph vztahu
   */
  public deleteDiagram(sequenceDiagram: M.Interaction) {
    // this.datastore.deleteRecord(M.Interaction, sequenceDiagram.id).subscribe(() => {
    //   console.log("Maze sa diagram:", sequenceDiagram);
    this.datastore.deleteRecord(M.InteractionFragment, sequenceDiagram.fragment.fragmentable.id)
      .subscribe();
    location.reload();
    // });
  }

  protected initializeDeleteOperation() {

    this.inputService.onLeftClick((event) => {
      if (this.performingDelete) {
        switch (event.model.type) {

          case 'Message':
            let message = this.datastore.peekRecord(M.Message, event.model.id);
            this.calculateTimeOnMessageDelete(message);
            this.datastore.deleteRecord(M.Message, message.id).subscribe(() => {
              location.reload();
            });
            this.performingDelete = false;
            break;

          case 'Lifeline':
            let lifeline = this.datastore.peekRecord(M.Lifeline, event.model.id);
            this.calculateLifelinesOrder(lifeline);
            this.datastore.deleteRecord(M.Lifeline, lifeline.id).subscribe(() => {
              location.reload();
            });
            this.performingDelete = false;
            break;
          case 'Layer':
            let interaction = this.datastore.peekRecord(M.Interaction, event.model.id);
            // maze iba z tabulky Interaction Fragment, na backende sa dorobi automaticke mazanie morph vztahu 
            // this.datastore.deleteRecord(M.Interaction, interaction.id).subscribe(() => {
            // console.log("Maze sa interakcia:", interaction);
            this.datastore.deleteRecord(M.InteractionFragment, interaction.fragment.fragmentable.id)
              .subscribe();
            location.reload();
            // });
            this.performingDelete = false;
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

  protected calculateTimeOnMessageDelete(message: M.Message) {

    let deletedMessageTime = message.sendEvent.time;
    let lifelinesInCurrentLayer = message.interaction.lifelines;

    // prechadzam Occurence Spec. na vsetkych lifelinach a znizujem time o 1
    for (let lifeline of lifelinesInCurrentLayer) {
      for (let occurrence of lifeline.occurrenceSpecifications) {
        if (occurrence.time >= deletedMessageTime) {
          let occurenceForChange = this.datastore.peekRecord(M.OccurrenceSpecification, occurrence.id);
          occurenceForChange.time = occurenceForChange.time - 1;
          occurenceForChange.save().subscribe();
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
              location.reload();
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

    // TODO: Napad - Pridavat message vzdy najviac na vrch ako sa da, podla mna to sa tak ma aj v EAcku
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
            // TODO: nazvat message ako chcem
            name: result,
            sort: "synchCall",
            // TODO: zmenit dynamicky na interaction / fragment v ktorom som
            interaction: this.datastore.peekRecord(M.Interaction, sourceLifelineModel.interaction.id),
            sendEvent: sourceOccurence,
            receiveEvent: destinationOccurence
          }).save().subscribe((message: M.Message) => {
            //this.calculateTimeOnMessageInsert(message);
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
    /*if (!move) {
      for (let lifeline of lifelinesInCurrentLayer) {
        for (let occurrence of lifeline.occurrenceSpecifications) {
          if (occurrence.time > maxTimeValue) {
            maxTimeValue = occurrence.time;
          }
        }
      }
    }*/

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

  protected calculateTimeOnMessageUpdate(currentInteraction: M.Interaction, time: number,
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
    /*if (!move) {
      for (let lifeline of lifelinesInCurrentLayer) {
        for (let occurrence of lifeline.occurrenceSpecifications) {
          if (occurrence.time > maxTimeValue) {
            maxTimeValue = occurrence.time;
          }
        }
      }
    }*/

    //TODO : doriesit aby sa neposunuli obe message na rovnake miesto ---  if (occurrence.time >= time), nejak id porovnat alebo podobne
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
}