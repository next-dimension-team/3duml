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
  }


  /**
   * Create Operation
   */
  protected lifelineBefore: M.Lifeline;
  protected addingLifelineEvent: Event;





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

}