import { JsonApiModel, JsonApiModelConfig, Attribute, HasMany, BelongsTo } from 'angular2-jsonapi';
import * as M from './';

@JsonApiModelConfig({
    type: 'occurrence-specifications'
})
export class OccurrenceSpecification extends JsonApiModel {

  @Attribute()
  time: number;

  @HasMany()
  sendingEventMessages: M.Message[];

  @HasMany()
  receivingEventMessages: M.Message[];

  @HasMany()
  startingExecutionSpecifications: M.ExecutionSpecification[];

  @HasMany()
  finishingExecutionSpecifications: M.ExecutionSpecification[];

  @BelongsTo()
  covered: M.Lifeline;

}
