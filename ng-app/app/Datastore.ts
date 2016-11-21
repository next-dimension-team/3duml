import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { JsonApiDatastoreConfig, JsonApiDatastore } from 'angular2-jsonapi';

@Injectable()
@JsonApiDatastoreConfig({
  baseUrl: 'http://localhost/api/',
  models: {
    // add config of models 
  }
})
export class Datastore extends JsonApiDatastore {

    constructor(http: Http) {
        super(http);
    }

}
