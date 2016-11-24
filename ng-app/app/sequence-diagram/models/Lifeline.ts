import { JsonApiModelConfig, JsonApiModel, Attribute, HasMany, BelongsTo } from 'angular2-jsonapi';
import { OccurrenceSpecification } from './OccurrenceSpecification';
import { Layer } from './Layer';

@JsonApiModelConfig({
    type: 'lifelines'
})
export class Lifeline extends JsonApiModel {

  @Attribute()
  name: string;

  @HasMany()
  occurrenceSpecifications: OccurrenceSpecification[];

  @BelongsTo()
  fragment: Layer;

}
