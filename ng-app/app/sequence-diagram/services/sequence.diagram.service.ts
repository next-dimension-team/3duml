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
      if (event.model.type == "Message" && this.performingDelete) {
        let message = this.datastore.peekRecord(M.Message, event.model.id);
        this.calculateTimeOnMessageDelete(message);
        this.datastore.deleteRecord(M.Message, message.id).subscribe(() => {
          this.datastore.deleteRecord(M.OccurrenceSpecification, message.receiveEvent.id).subscribe(() => {
            this.datastore.deleteRecord(M.OccurrenceSpecification, message.sendEvent.id).subscribe(() => {
            location.reload();
            });
          });
          this.performingDelete = false;
        });
      }
    });
  }

  protected calculateTimeOnMessageDelete(message: M.Message){

    let deletedMessageTime = message.sendEvent.time;
    let receiveLifeline = message.receiveEvent.covered;
    let sendLifeline = message.sendEvent.covered;

    // prechadzam Occurence Spec. receive lifeliny a znizujem time o 1
    for (let occurrence of receiveLifeline.occurrenceSpecifications) {
      if (occurrence.time > deletedMessageTime){
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
      if (occurrence.time > deletedMessageTime){
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

  // TODO: chceme posuvat len ak sme tafili uz nejaku existujucu messagu
  protected calculateTimeOnMessageInsert(message: M.Message){

    let move = false;
    let insertedMessageTime = message.sendEvent.time;
    let sendLifeline = message.sendEvent.covered;
    let receiveLifeline = message.receiveEvent.covered;

    for (let occurrence of sendLifeline.occurrenceSpecifications) {
      if (occurrence.time == insertedMessageTime) {
        move = true;
        console.log("Nasiel som rovnaky occ na prvej");
        break;
      }
    }

    if (move) {
      for (let occurrence of receiveLifeline.occurrenceSpecifications) {
        if (occurrence.time == insertedMessageTime) {
          move = true;
          console.log("Nasiel som rovnaky occ na druhej");
          break;
        }
      }
    }


    if (move) {
      // prechadzam Occurence Spec. receive lifeliny a znizujem time o 1
      for (let occurrence of receiveLifeline.occurrenceSpecifications) {
        if (occurrence.time >= insertedMessageTime){
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
        if (occurrence.time >= insertedMessageTime){
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
      let averageTime = Math.round((((sourceLifeline.offsetY + destinationLifeline.offsetY) / 2.0) - 120) / 40.0);

      let sourceOccurence = this.datastore.createRecord(M.OccurrenceSpecification, {
        // TODO: konstantu 40 treba tahat z configu, aj 120 brat z configu
        time: averageTime,
        covered: sourceLifelineModel
      });
      console.log("CAS" + averageTime);
      sourceOccurence.save().subscribe((sourceOccurence: M.OccurrenceSpecification) => {
        let destinationOccurence = this.datastore.createRecord(M.OccurrenceSpecification, {
          // TODO: konstantu 40 treba tahat z configu, aj 120 brat z configu
          time: averageTime,
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

  /**
   * Update Operation
   */

  // TODO

}
