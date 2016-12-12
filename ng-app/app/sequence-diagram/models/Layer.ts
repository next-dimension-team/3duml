import { JsonApiModelConfig, JsonApiModel, Attribute, HasMany } from 'angular2-jsonapi';
import { Lifeline } from './Lifeline';
import { BaseJsonApiModel } from './BaseJsonApiModel';
import { Observable } from 'rxjs/Observable';

@JsonApiModelConfig({
    type: 'layers'
})
export class Layer extends BaseJsonApiModel {

  @Attribute()
  depth: number;

  @HasMany()
  lifelines: Lifeline[];

  get _lifelines(): Observable<Lifeline[]> {
    return this.lazyLoadRelation('lifelines');
  }

}
