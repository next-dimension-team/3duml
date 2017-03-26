import { Injectable } from '@angular/core';
import { Datastore } from '../../datastore';
import { JsonApiModel, ModelType } from 'angular2-jsonapi';
import { Observable } from 'rxjs';
import { InputService } from './input.service';
import { InputDialogComponent } from './input-dialog.component';
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
  private editMode = false;

  public initialize() {
    this.initializeDeleteOperation();
    this.initializeAddMessageOperation();
    this.initializeAddLifeline();
    this.initializeRenameElement();
    this.moveLifeline();
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
      location.reload();
    });
  }

  protected lifelineBefore: M.Lifeline;
  protected selectedLifeline: M.Lifeline;
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

  public setEditMode(type : boolean) {
    this.editMode = type;
  }

  public moveLifeline(){
    let moveBool = false;
    this.inputService.onMouseDown((event) => {
      if (event.model.type == 'Lifeline') {
        this.selectedLifeline = this.datastore.peekRecord(M.Lifeline, event.model.id);
        moveBool = true;
      }
    });
    this.inputService.onMouseUp((event) => {
      if (moveBool && this.selectedLifeline != null) {
        console.log(this.editMode);
        if (this.editMode == false) {
          this.selectedLifeline = null;
          return;
        }
        moveBool = false;
        let interaction = this.selectedLifeline.interaction;
        let lifelinesInInteraction = interaction.lifelines;
        let lifelineOrder = this.selectedLifeline.order;
        let position = Math.floor(event.offsetX / 400.0);
        let numOfLifelines = lifelinesInInteraction.length;
        if (position <= 0) {
          position = 1;
        }
        if (position > numOfLifelines) {
          position = numOfLifelines;
        }
        if (position == this.selectedLifeline.order) {
          return;
        }
        console.log(position);
        for (let lifeline of lifelinesInInteraction) {
          console.log(lifeline);
          if (lifeline.id == this.selectedLifeline.id) {
            lifeline.order = position;
            lifeline.save().subscribe();
            continue;
          }
          else if (lifeline.order > this.selectedLifeline.order && lifeline.order <= position) {
            lifeline.order--;
            lifeline.save().subscribe();
            continue;
          }
          else if (lifeline.order < this.selectedLifeline.order && lifeline.order >= position) {
            lifeline.order++;
            lifeline.save().subscribe();
            continue;
          }
        }
        location.reload();
      }
    });
    this.selectedLifeline = null;
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
        //TODO dorobit podla offesetX
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
   * Rename Operation
   */
  protected renamingLayer = false;

  public renameDiagram(sequenceDiagram: M.Interaction){

    let editDialog;
    editDialog = this.inputService.createInputDialog("Edit Diagram", sequenceDiagram.name, "Enter Diagram name");
    editDialog.componentInstance.onOk.subscribe(result => {
      sequenceDiagram.name = result;
      sequenceDiagram.save().subscribe();
    });  
  }

  public renameLayer(interactionFragment: M.InteractionFragment){

    let editDialog;
    
    let layer = this.datastore.peekRecord(M.Interaction, interactionFragment.fragmentable.id);
    editDialog = this.inputService.createInputDialog("Edit layer", layer.name, "Enter Layer name");
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
          editDialog = this.inputService.createInputDialog("Edit message", message.name, "Enter message name");
          editDialog.componentInstance.onOk.subscribe(result => {
            message.name = result;
            message.save().subscribe();
          });  
        break;
        case 'Lifeline':
          let lifeline = this.datastore.peekRecord(M.Lifeline, event.model.id);
          editDialog = this.inputService.createInputDialog("Edit lifeline", lifeline.name, "Enter lifeline name");
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
                location.reload();
              });
              this.performingDelete = false;
            });
            confirmDialog.componentInstance.onNo.subscribe(result => {
              this.performingDelete = false;
            });
            break;

          case 'Lifeline':
            let lifeline = this.datastore.peekRecord(M.Lifeline, event.model.id);
            confirmDialog = this.inputService.createConfirmDialog("Delete lifeline", "Do you really want to delete lifeline \"" + lifeline.name + "\" ?");

            confirmDialog.componentInstance.onYes.subscribe(result => {
              this.calculateLifelinesOrder(lifeline);
              this.datastore.deleteRecord(M.Lifeline, lifeline.id).subscribe(() => {
                location.reload();
              });
              confirmDialog.componentInstance.onNo.subscribe(result => {
                this.performingDelete = false;
              });
            });
          break;
            
          case 'Layer':
            let interaction = this.datastore.peekRecord(M.Interaction, event.model.id);
            confirmDialog = this.inputService.createConfirmDialog("Delete layer", "Do you really want to delete layer \"" + interaction.name + "\" ?");

            confirmDialog.componentInstance.onYes.subscribe(result => {
              // maze iba z tabulky Interaction Fragment, na backende sa dorobi automaticke mazanie morph vztahu 
              // this.datastore.deleteRecord(M.Interaction, interaction.id).subscribe(() => {
              // console.log("Maze sa interakcia:", interaction);
                this.datastore.deleteRecord(M.InteractionFragment, interaction.fragment.fragmentable.id)
                .subscribe();
                location.reload();
              // });
              this.performingDelete = false;
            });
            confirmDialog.componentInstance.onNo.subscribe(result => {
              this.performingDelete = false;
            });
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
    let time = Math.round(sourceLifeline.model.time);
    let messageName;

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
            //this.calculateTimeOnMessageInsert(message);
            callback(message);
          });
        });
      });
    });
  }

  // TODO: pridavanie 3D sipky
  /*protected calculateTimeOnMessageInsert(message: M.Message){

    let move = false;
    let insertedMessageTime = message.sendEvent.time;
    let sendLifeline = message.sendEvent.covered;
    let receiveLifeline = message.receiveEvent.covered;

    for (let occurrence of sendLifeline.occurrenceSpecifications) {
      if (occurrence.time == insertedMessageTime) {
        move = true;
        break;
      }
    }

    if (move) {
      for (let occurrence of receiveLifeline.occurrenceSpecifications) {
        if (occurrence.time == insertedMessageTime) {
          move = true;
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
  }*/

  /**
   * Update Operation
   */

  // TODO
}