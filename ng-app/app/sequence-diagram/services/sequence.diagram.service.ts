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
  protected sourceLifelineEvent = null;
  protected sourceLifelineEventModel = null;
  protected destinationLifelineEvent = null;
  protected destinationLifelineEventModel = null;
  protected performingMessageAdding = false;
  protected addingMessageInteraction = null;

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

  public performDelete() {
    this.performingDelete = true;
  }

  protected initializeDeleteOperation() {
    this.inputService.onLeftClick((event) => {
      if (event.model.type == "Message" && this.performingDelete) {
        this.datastore.deleteRecord(M.Message, event.model.id).subscribe(() => {
          console.log("Maze sa sprava s id:", event.model.id);
          this.performingDelete = false;
          location.reload();
        });
      }
    });
  }

  protected initializeAddMessageOperation() {
    this.inputService.onRightClick((event) => {

      if (event.model.type == "Lifeline") {
        this.performingMessageAdding = true;
      }
      if (event.model.type == "Layer" && this.performingMessageAdding) {
        this.addingMessageInteraction = event;
        this.handleLifelineClick(event);
      }
      console.log("--------------------------------");
      console.info("Event typu: RightClick");
      console.log("Klikol si na " + event.model.type + " s ID " + event.model.id);
      console.log("Súradnice tvojho kliknutia zľava: " + event.offsetX);
      console.log("Súradnice tvojho kliknutia zhora: " + event.offsetY);
    });
  }

  protected handleLifelineClick(event: MouseEvent) {
    if (this.sourceLifelineEvent) {
      this.destinationLifelineEvent = event.model;
      this.destinationLifelineEvent = event;
      console.log("Toto je lifelineKAM mam ist");
      console.log(this.destinationLifelineEvent.model.id);
      console.log("Toto je lifelineOdkial mam ist");
      console.log(this.sourceLifelineEvent.model.id);
      console.log("-------------------------------------------------------");
      console.log();

      this.createMessage(this.sourceLifelineEvent, this.sourceLifelineEventModel, this.destinationLifelineEvent, this.destinationLifelineEventModel, this.addingMessageInteraction);
      this.sourceLifelineEvent = null;
      this.destinationLifelineEvent = null;
    }
    else {
      this.sourceLifelineEvent = event;
      this.sourceLifelineEventModel = event.model;
      console.log("Toto je lifelineOdkial mam ist");
      console.log(this.sourceLifelineEvent.model.id);
    }
  }

  createMessage(fromEvent: MouseEvent, fromLifelineModel: M.Lifeline, toEvent: MouseEvent, toLifelineModel: M.Lifeline, layer: M.Layer): void{
    this.addMessage(fromEvent, fromLifelineModel, toEvent, toLifelineModel, layer, (message: M.Message) => {
      console.log("Vytvorena message v DB");
      console.log(this.sourceLifelineEvent);
    });
  }

  public addMessage(fromEvent: MouseEvent, fromLifelineModel: M.Lifeline, toEvent: MouseEvent, toLifelineModel: M.Lifeline, layer: M.Layer, callback: any) {

    this.datastore.findRecord(M.Lifeline, fromLifelineModel.id).subscribe((fromLifeline: M.Lifeline) => console.log("EZ",fromLifeline)
    );

    let sourceOccurence = this.datastore.createRecord(M.OccurrenceSpecification, {
      time: Math.round(fromEvent.offsetY/40),
      covered: fromLifeline
    });
    sourceOccurence.save().subscribe(callback);

    sourceOccurence.save().subscribe((sourceOccurence: M.OccurrenceSpecification)=> {
      let destinationOccurence = this.datastore.createRecord(M.OccurrenceSpecification, {
        time: Math.round(toEvent.offsetY/40),
        covered: toLifelineModel
      });

      destinationOccurence.save().subscribe((destinationOccurence: M.OccurrenceSpecification) =>{
        let message = this.datastore.createRecord(M.Message, {
          //TODO nazvat message ako chcem
          name: "send",
          sort: "synchCall",
          //TODO zmenit dynamicky na interaction, v ktorom realne som
          interaction: layer,
          sendEvent: sourceOccurence,
          receiveEvent: destinationOccurence
        });
        message.save().subscribe(callback);
      });
    });
  }

  // TODO

  /**
   * Update Operation
   */

  // TODO

}
