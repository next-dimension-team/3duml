import { JsonApiModel, JsonApiModelConfig, Attribute, BelongsTo } from 'angular2-jsonapi';
import { InteractionFragment } from './InteractionFragment';
import { OccurrenceSpecification } from './OccurrenceSpecification';

@JsonApiModelConfig({
  type: 'execution-specifications'
})
export class ExecutionSpecification extends JsonApiModel {

  @Attribute()
  public created_at: Date;

  @Attribute()
  public updated_at: Date;

  @BelongsTo()
  public fragment: InteractionFragment;

  @BelongsTo()
  public start: OccurrenceSpecification;

  @BelongsTo()
  public finish: OccurrenceSpecification;

}
