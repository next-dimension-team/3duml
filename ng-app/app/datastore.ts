import * as M from './sequence-diagram/models';


import { Injectable } from '@angular/core';

import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { JsonApiModel, JsonApiDatastore, JsonApiDatastoreConfig, ModelType } from 'angular2-jsonapi';

@Injectable()
@JsonApiDatastoreConfig({
  /*baseUrl: process.env.API_URL + 'api/v1/'*/
  baseUrl: '/api/v1/',
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

    private instance: DatastoreInstanceObject;
    private http2: Http;

    constructor(http: Http) {
        super(http);
        this.http2 = http;
        this.instance = new DatastoreInstanceObject(http);
    }

    addToStore(models: JsonApiModel | JsonApiModel[]): void {
      this.instance.addToStore(models);
    }

    query<T extends JsonApiModel>(modelType: ModelType<T>, params?: any, headers?: Headers): Observable<T[]> {
      return this.instance.query(modelType, params, headers);
    }
    findRecord<T extends JsonApiModel>(modelType: ModelType<T>, id: string, params?: any, headers?: Headers): Observable<T> {
      return this.instance.findRecord(modelType, id, params, headers);
    }
    createRecord<T extends JsonApiModel>(modelType: ModelType<T>, data?: any): T {
      return this.instance.createRecord(modelType, data);
    }
    saveRecord<T extends JsonApiModel>(attributesMetadata: any, model?: T, params?: any, headers?: Headers): Observable<T> {
      return this.instance.saveRecord(attributesMetadata, model, params, headers);
    }
    deleteRecord<T extends JsonApiModel>(modelType: ModelType<T>, id: string, headers?: Headers): Observable<Response> {
      return this.instance.deleteRecord(modelType, id, headers);
    }
    peekRecord<T extends JsonApiModel>(modelType: ModelType<T>, id: string): T {
      return this.instance.peekRecord(modelType, id);
    }
    peekAll<T extends JsonApiModel>(modelType: ModelType<T>): T[] {
      return this.instance.peekAll(modelType);
    }

    deleteCache() {
      this.instance = new DatastoreInstanceObject(this.http2);
    }


}


@JsonApiDatastoreConfig({
  /*baseUrl: process.env.API_URL + 'api/v1/'*/
  baseUrl: '/api/v1/',
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
class DatastoreInstanceObject extends JsonApiDatastore {

    constructor(http: Http) {
        super(http);
    }

}
