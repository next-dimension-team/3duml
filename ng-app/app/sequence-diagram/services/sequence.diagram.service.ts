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
    this.initializeMoveLifeline();
    this.initializeVerticalMessageMove();
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


}