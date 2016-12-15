import { JsonApiModel, JsonApiModelConfig, Attribute, HasMany, BelongsTo } from 'angular2-jsonapi';
import { Lifeline } from './Lifeline';
import { Message } from './Message';
import { ExecutionSpecification } from './ExecutionSpecification';

@JsonApiModelConfig({
    type: 'occurrence-specifications'
})
export class OccurrenceSpecification extends JsonApiModel {

  @Attribute()
  time: number;

  @HasMany()
  sendingEventMessages: Message[];

  @HasMany()
  receivingEventMessages: Message[];

  @HasMany()
  startingExecutionSpecifications: ExecutionSpecification[];

  @HasMany()
  finishingExecutionSpecifications: ExecutionSpecification[];

  @BelongsTo()
  covered: Lifeline;

}
