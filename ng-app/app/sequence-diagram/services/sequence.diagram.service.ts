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
  protected performingDelete = false;

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
  
  public performDelete() {
    this.performingDelete = true;
  }
  
  protected initializeDeleteOperation() {
    this.inputService.onLeftClick((event) => {
      console.log("model", event.model);
      if (event.model.type == "Message" && this.performingDelete) {
        let message = this.datastore.peekRecord(M.Message, event.model.id);
        this.calculateTime(message);
        console.log("Nasla sa messaga:",message);
        this.datastore.deleteRecord(M.Message, message.id).subscribe(() => {
          console.log("Maze sa sprava s id:", message.id);
          this.datastore.deleteRecord(M.OccurrenceSpecification, message.receiveEvent.id).subscribe(() => {
            console.log("Maze sa OccSpecif s id:", message.receiveEvent.id);
            this.datastore.deleteRecord(M.OccurrenceSpecification, message.sendEvent.id).subscribe(() => {
              console.log("Maze sa OccSpecif s id:", message.sendEvent.id);
              // location.reload();
            });
          });
          this.performingDelete = false;
        });
      }
    });
  }

  protected calculateTime(message: M.Message){

    let deletedMessageTime = message.sendEvent.time;
    let receiveLifeline = message.receiveEvent.covered;
    let sendLifeline = message.sendEvent.covered;

    console.log("OS OF LAJFLAJNY", receiveLifeline.occurrenceSpecifications); 

    for (let occurrence of receiveLifeline.occurrenceSpecifications) {
      if (occurrence.time > deletedMessageTime){
        console.log("OKURENCIA TAJM", occurrence.time);
        teraz to znizit o 1 treba, zober id occurence spec a znizit
        this.datastore.findRecord(M.OccurrenceSpecifiation, occcurence.id).subscribe(
          (occurrenceSpecification: M.OccurrenceSpecifiation) => {
            occurrenceSpecification.time = occurrenceSpecification.time - 1;
          }
        );
      }
    }

    for (let occurrence of sendLifeline.occurrenceSpecifications) {
      if (occurrence.time > deletedMessageTime){
        console.log("OKURENCIA JE VECSIA", occurrence);
        // teraz to znizit o 1 treba, zober id occurence spec a znizit
        this.datastore.findRecord(M.OccurrenceSpecifiation, occcurence.id).subscribe(
          (occurrenceSpecification: M.OccurrenceSpecifiation) => {
            occurrenceSpecification.time = occurrenceSpecification.time - 1;
          }
        );
      }
    }

  }
  // TODO

  /**
   * Update Operation
   */

  // TODO

}
