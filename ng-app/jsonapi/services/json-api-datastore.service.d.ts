import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { JsonApiModel } from '../models/json-api.model';
import { Map } from 'immutable';
export declare type ModelType<T extends JsonApiModel> = {
    new (datastore: JsonApiDatastore, data: any): T;
};
export declare class JsonApiDatastore {
    private http;
    private _headers;
    private _store: Map<string, Map<string, any>>;
    constructor(http: Http);
    query<T extends JsonApiModel>(modelType: ModelType<T>, params?: any, headers?: Headers): Observable<T[]>;
    findRecord<T extends JsonApiModel>(modelType: ModelType<T>, id: string, params?: any, headers?: Headers): Observable<T>;
    createRecord<T extends JsonApiModel>(modelType: ModelType<T>, data?: any): T;
    saveRecord<T extends JsonApiModel>(attributesMetadata: any, model?: T, params?: any, headers?: Headers): Observable<T>;
    deleteRecord<T extends JsonApiModel>(modelType: ModelType<T>, id: string, headers?: Headers): Observable<Response>;
    peekRecord<T extends JsonApiModel>(modelType: ModelType<T>, id: string): T;
    peekAll<T extends JsonApiModel>(modelType: ModelType<T>): T[];
    headers: Headers;
    private buildUrl<T>(modelType, params?, id?);
    private getRelationships(data);
    private extractQueryData<T>(res, modelType);
    private extractRecordData<T>(res, modelType, model?);
    protected handleError(error: any): ErrorObservable;
    private getOptions(customHeaders?);
    private toQueryString(params);
    addToStore(models: JsonApiModel | JsonApiModel[]): void;
    private fromArrayToHash(models);
    private resetMetadataAttributes<T>(res, attributesMetadata, modelType);
    private updateRelationships(model, relationships);
}
