import { Datastore } from '../../datastore';
import * as M from '../models';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { NgrxJsonApiService, StoreResource, ManyQueryResult } from 'ngrx-json-api';

@Injectable()
export class SequenceDiagramService {

  constructor(
    protected datastore: Datastore,
    protected ngrxJsonApiService: NgrxJsonApiService
  ) { }

  /*
   * Get the list of sequence diagrams
   */
  public getSequenceDiagrams(): Observable<StoreResource[]> {
    return this.ngrxJsonApiService.findMany({
      query: {
        type: 'InteractionFragment',
        params: {
          include: ['fragmentable'],
          filtering: [{
            path: 'roots',
            value: 1 // true
          }]
        }
      },
      denormalise: true
    }).map((result: ManyQueryResult) => {
      if (!result.loading) {
        return result.data.map((resource: StoreResource) => {
          return resource.relationships.fragmentable.reference;
        });
      }
    });
  }

  /*
   * Load recursively the full interaction fragments tree
   */
  public loadSequenceDiagramTree(interaction: StoreResource) /* : Observable<StoreResource> */ {
    let id = interaction.id;

    return this.ngrxJsonApiService.findMany({
      query: {
        type: 'InteractionFragment',
        params: {
          include: [
            'fragmentable.lifelines',
            'fragmentable.messages.sendEvent.covered',
            'fragmentable.messages.receiveEvent.covered',
            'fragmentable.start.covered',
            'fragmentable.finish.covered'
          ],
          filtering: [{
            path: 'descendants',
            value: id
          }]
        }
      },
      denormalise: true
    }).map((result: ManyQueryResult) => {
      if (!result.loading) {
        return _.find(result.data, ['id', id])
      }
    });
  }

}