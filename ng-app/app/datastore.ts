import * as M from './sequence-diagram/models';

import { JsonApiDatastore, JsonApiDatastoreConfig } from 'angular2-jsonapi';

import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
@JsonApiDatastoreConfig({
  baseUrl: process.env.API_URL + 'api/v1/',
  models: {
    'combined-fragments': M.CombinedFragment,
    'execution-specifications': M.ExecutionSpecification,
    'interactions': M.Interaction,
    'interaction-fragments': M.InteractionFragment,
    'interaction-operands': M.InteractionOperand,
    'lifelines': M.Lifeline,
    'messages': M.Message,
    'occurrence-specifications': M.OccurrenceSpecification
  }
})
export class Datastore extends JsonApiDatastore {

    constructor(http: Http) {
        super(http);
    }

}
