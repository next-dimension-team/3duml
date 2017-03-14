import { Injectable } from '@angular/core';
import { Datastore } from '../../datastore';
import { JsonApiModel, ModelType } from 'angular2-jsonapi';
import { Observable } from 'rxjs';
import { InputService } from './input.service';
import * as _ from 'lodash';
import * as M from '../models';

@Injectable()
export class SequenceDiagramService {

  protected static initialized = false;

  constructor(protected datastore: Datastore, protected inputService: InputService) {
    // Initialize the service
    if (! SequenceDiagramService.initialized) {
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
  public createDiagram(name: string, callback: any) {
    let interaction = this.datastore.createRecord(M.Interaction, {
      name: name
    });

    interaction.save().subscribe((interaction: M.Interaction) => {
      let interactionFragment = this.datastore.createRecord(M.InteractionFragment, {
        fragmentable: interaction
      });

      interactionFragment.save().subscribe(callback);
    });
  }

  /**
   * Delete Operation
   */

  protected performingDelete = false;
  
  public performDelete() {
    this.performingDelete = true;
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
              console.log("Maze sa lifeline:", lifeline);
              location.reload();
            });
            this.performingDelete = false;
          break;
        }
      }
    });
  }
  
  /**
   * Funkcia upravuje atribut 'order' na Lifeline
   */
  protected calculateLifelinesOrder(lifeline: M.Lifelines) {

    let deletedLifelineOrder = lifeline.order;
    let interaction = lifeline.interaction;
    let lifelinesInInteraction = interaction.lifelines;

    // ak je order lifeliny vecsi ako order vymazanej lifeliny tak ho zmensim o 1 
    for (let lifeline of lifelinesInInteraction) {
      if (lifeline.order > deletedLifelineOrder) {
        this.datastore.findRecord(M.Lifeline, lifeline.id).subscribe(
          (lifeline: M.Lifeline) => {
            lifeline.order = lifeline.order - 1;
            lifeline.save().subscribe();
          }
        );
      }
    }  
  }

  protected calculateTimeOnMessageDelete(message: M.Message) {

    let deletedMessageTime = message.sendEvent.time;
    let receiveLifeline = message.receiveEvent.covered;
    let sendLifeline = message.sendEvent.covered;

    // prechadzam Occurence Spec. receive lifeliny a znizujem time o 1
    for (let occurrence of receiveLifeline.occurrenceSpecifications) {
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
    // prechadzam Occurence Spec. send lifeliny a znizujem time o 1
    for (let occurrence of sendLifeline.occurrenceSpecifications) {
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

  /**
   * Insert Operation
   */

  protected sourceLifelineEvent = null;
  protected destinationLifelineEvent = null;
  
  protected initializeAddMessageOperation() {
    this.inputService.onRightClick((event) => {
      if (event.model.type == "Lifeline") {
        if (this.sourceLifelineEvent) {
          this.destinationLifelineEvent = event;
          this.createMessage(this.sourceLifelineEvent, this.destinationLifelineEvent, (message: M.Message) => {
            console.log("Vytvorena message v DB");
          });
          this.sourceLifelineEvent = null;
          this.destinationLifelineEvent = null;
        }
        else {
          this.sourceLifelineEvent = event;
        }
      }
    });
  }

  protected createMessage(sourceLifeline: MouseEvent, destinationLifeline: MouseEvent, callback: any) {
      let sourceLifelineModel = this.datastore.peekRecord(M.Lifeline, sourceLifeline.model.id);
      let destinationLifelineModel = this.datastore.peekRecord(M.Lifeline, destinationLifeline.model.id);

      let sourceOccurence = this.datastore.createRecord(M.OccurrenceSpecification, {
        // TODO: konstantu 40 treba tahat z configu, aj 120 brat z configu
        time: Math.round((sourceLifeline.offsetY - 120) / 40),
        covered: sourceLifelineModel
      });

      sourceOccurence.save().subscribe((sourceOccurence: M.OccurrenceSpecification) => {
        let destinationOccurence = this.datastore.createRecord(M.OccurrenceSpecification, {
          // TODO: konstantu 40 treba tahat z configu, aj 120 brat z configu
          time: Math.round((destinationLifeline.offsetY - 120) / 40),
          covered: destinationLifelineModel
        });

        destinationOccurence.save().subscribe((destinationOccurence: M.OccurrenceSpecification) => {
          this.datastore.createRecord(M.Message, {
            //TODO nazvat message ako chcem
            name: "send",
            sort: "synchCall",
            //TODO zmenit dynamicky na interaction, v ktorom realne som
            interaction: this.datastore.peekRecord(M.Interaction, sourceLifelineModel.interaction.id),
            sendEvent: sourceOccurence,
            receiveEvent: destinationOccurence
          }).save().subscribe((message: M.Message) => {
            this.calculateTimeOnMessageInsert(message);
            callback(message);
          });
        });
      });
  }

  // TODO: chceme posuvat len ak sme tafili uz nejaku existujucu messagu
  // TODO: nie je mozne pridavat messadu na jednej lifelines
  // TODO: pridavanie 3D sipky
  protected calculateTimeOnMessageInsert(message: M.Message) {

    let insertedMessageTime = message.sendEvent.time;
    let receiveLifeline = message.receiveEvent.covered;
    let sendLifeline = message.sendEvent.covered;

    // prechadzam Occurence Spec. receive lifeliny a znizujem time o 1
    for (let occurrence of receiveLifeline.occurrenceSpecifications) {
      if (occurrence.time >= insertedMessageTime) {
        // teraz to znizit o 1 treba, zober id occurence spec a znizit
        this.datastore.findRecord(M.OccurrenceSpecification, occurrence.id).subscribe(
          (occurrenceSpecification: M.OccurrenceSpecification) => {
            occurrenceSpecification.time = occurrenceSpecification.time + 1;
            occurrenceSpecification.save().subscribe();
          }
        );
      }
    }
    // prechadzam Occurence Spec. send lifeliny a znizujem time o 1
    for (let occurrence of sendLifeline.occurrenceSpecifications) {
      if (occurrence.time >= insertedMessageTime) {
        // teraz to znizit o 1 treba, zober id occurence spec a znizit
        this.datastore.findRecord(M.OccurrenceSpecification, occurrence.id).subscribe(
          (occurrenceSpecification: M.OccurrenceSpecification) => {
            occurrenceSpecification.time = occurrenceSpecification.time + 1;
            occurrenceSpecification.save().subscribe();
          }
        );
      }
    }
  }

  /**
   * Update Operation
   */

  // TODO

}
