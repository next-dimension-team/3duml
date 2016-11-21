import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { JsonApiDatastoreConfig, JsonApiDatastore } from 'angular2-jsonapi';
import * as sd from './sequence-diagram/models';

@Injectable()
@JsonApiDatastoreConfig({
  baseUrl: 'http://localhost/api/',
  models: {
    'combined-fragments': sd.CombinedFragment,
    'execution-specifications': sd.ExecutionSpecification,
    'interactions': sd.Interaction,
    'interaction-fragments': sd.InteractionFragment,
    'interaction-operands': sd.InteractionOperand,
    'lifelines': sd.Lifeline,
    'messages': sd.Message,
    'occurrence-specifications': sd.OccurrenceSpecification,
  }
})
export class Datastore extends JsonApiDatastore {

    constructor(http: Http) {
        super(http);
    }

}
