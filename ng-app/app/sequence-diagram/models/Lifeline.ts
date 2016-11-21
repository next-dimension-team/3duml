import { JsonApiModelConfig, JsonApiModel, Attribute, HasMany } from 'angular2-jsonapi';
import { OccurrenceSpecification } from './OccurrenceSpecification';

@JsonApiModelConfig({
    type: 'Lifeline'
})
export class Lifeline extends JsonApiModel {

  @Attribute()
  name: string;

  @HasMany()
  occurrenceSpecifications: OccurrenceSpecification[];

}
