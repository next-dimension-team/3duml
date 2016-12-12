import { JsonApiModel, JsonApiDatastore } from 'angular2-jsonapi';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/share';

export class BaseJsonApiModel extends JsonApiModel {

  protected _datastore: JsonApiDatastore;
  private _observable: Observable<any>;

  constructor(_datastore: JsonApiDatastore, data?: any) {
    super(_datastore, data);
    this._datastore = _datastore;
  }

  protected lazyLoadRelation(name: string): Observable<any> {
    if (this[name]) {
      return Observable.of(this[name]);
    } else {
      return this.getObservable(name).map(data => data[name]);
    }
  }

  private getObservable(name: string): Observable<any> {
    let peek = this._datastore.peekRecord(this.constructor, this.id);

    if (peek && peek[name]) {
      return Observable.of(peek);
    }

    if (this._observable) {
      return this._observable;
    }

    return this._observable = this._datastore.findRecord(this.constructor, this.id).share();
  }

}
