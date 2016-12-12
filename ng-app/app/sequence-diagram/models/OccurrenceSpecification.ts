import { JsonApiModelConfig, Attribute, HasMany, BelongsTo } from 'angular2-jsonapi';
import { Lifeline } from './Lifeline';
import { Message } from './Message';
import { ExecutionSpecification } from './ExecutionSpecification';
import { BaseJsonApiModel } from './BaseJsonApiModel';
import { Observable } from 'rxjs/Observable';

@JsonApiModelConfig({
    type: 'occurrence-specifications'
})
export class OccurrenceSpecification extends BaseJsonApiModel {

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

  get _sendingEventMessages(): Observable<Message[]> {
    return this.lazyLoadRelation('sendingEventMessages');
  }

  get _receivingEventMessages(): Observable<Message[]> {
    return this.lazyLoadRelation('receivingEventMessages');
  }

  get _startingExecutionSpecifications(): Observable<ExecutionSpecification[]> {
    return this.lazyLoadRelation('startingExecutionSpecifications');
  }

  get _finishingExecutionSpecifications(): Observable<ExecutionSpecification[]> {
    return this.lazyLoadRelation('finishingExecutionSpecifications');
  }

  get _covered(): Observable<Lifeline> {
    return this.lazyLoadRelation('covered');
  }

}
