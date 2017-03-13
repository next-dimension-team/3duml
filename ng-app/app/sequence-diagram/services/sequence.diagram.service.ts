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
    this.inputService.onLeftClick((event) => {
      console.log(event);
    });
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

  // TODO

  /**
   * Update Operation
   */

  // TODO

}
