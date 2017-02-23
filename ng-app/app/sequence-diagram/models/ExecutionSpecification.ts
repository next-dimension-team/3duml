import { JsonApiModel, JsonApiModelConfig, Attribute, BelongsTo } from 'angular2-jsonapi';
import { InteractionFragment } from './InteractionFragment';
import { OccurrenceSpecification } from './OccurrenceSpecification';

@JsonApiModelConfig({
    type: 'execution-specifications'
})
export class ExecutionSpecification extends JsonApiModel {

  @Attribute()
  created_at: Date;

  @Attribute()
  updated_at: Date;

  @BelongsTo()
  fragment: InteractionFragment;

  @BelongsTo()
  start: OccurrenceSpecification;

  @BelongsTo()
  finish: OccurrenceSpecification;

}
