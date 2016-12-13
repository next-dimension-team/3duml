import { JsonApiModelConfig, Attribute, HasMany, BelongsTo } from 'angular2-jsonapi';
import { OccurrenceSpecification } from './OccurrenceSpecification';
import { Layer } from './Layer';
import { BaseJsonApiModel } from './BaseJsonApiModel';
import { Observable } from 'rxjs/Observable';

@JsonApiModelConfig({
    type: 'lifelines'
})
export class Lifeline extends BaseJsonApiModel {

  @Attribute()
  name: string;

  @HasMany()
  occurrence_specifications: OccurrenceSpecification[];

  @BelongsTo()
  layer: Layer;

  get _occurrenceSpecifications(): Observable<OccurrenceSpecification[]> {
    return this.lazyLoadRelation('occurrence_specifications');
  }

  get _layer(): Observable<Layer> {
    return this.lazyLoadRelation('layer');
  }

}
