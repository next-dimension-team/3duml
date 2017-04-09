import { JsonApiModel, JsonApiModelConfig, Attribute, HasMany, BelongsTo } from 'angular2-jsonapi';
import * as M from './';

@JsonApiModelConfig({
  type: 'occurrence-specifications'
})
export class OccurrenceSpecification extends JsonApiModel {

  @Attribute()
  public time: number;

  @Attribute()
  public created_at: Date;

  @Attribute()
  public updated_at: Date;

  @HasMany()
  public sendingEventMessages: M.Message[] = [];

  @HasMany()
  public receivingEventMessages: M.Message[] = [];

  @HasMany()
  public startingExecutionSpecifications: M.ExecutionSpecification[] = [];

  @HasMany()
  public finishingExecutionSpecifications: M.ExecutionSpecification[] = [];

  @BelongsTo()
  public covered: M.Lifeline;

}
