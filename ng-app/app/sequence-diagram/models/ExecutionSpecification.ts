import { JsonApiModelConfig, JsonApiModel, Attribute, BelongsTo } from 'angular2-jsonapi';
import { InteractionFragment } from './InteractionFragment';
import { OccurrenceSpecification } from './OccurrenceSpecification';

@JsonApiModelConfig({
    type: 'ExecutionSpecification'
})
export class ExecutionSpecification extends JsonApiModel {

  @Attribute()
  name: string;

  @BelongsTo()
  fragment: InteractionFragment;

  @BelongsTo()
  start: OccurrenceSpecification;

  @BelongsTo()
  finish: OccurrenceSpecification;

}
