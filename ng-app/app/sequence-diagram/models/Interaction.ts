import { JsonApiModelConfig, Attribute, HasMany, BelongsTo } from 'angular2-jsonapi';
import { InteractionFragment } from './InteractionFragment';
import { Message } from './Message';
import { BaseJsonApiModel } from './BaseJsonApiModel';
import { Observable } from 'rxjs/Observable';

@JsonApiModelConfig({
    type: 'interactions'
})
export class Interaction extends BaseJsonApiModel {

  @Attribute()
  name: string;

  @BelongsTo()
  fragment: InteractionFragment;

  @HasMany()
  messages: Message[];

  get _fragment(): Observable<InteractionFragment> {
    return this.lazyLoadRelation('fragment');
  }

  get _messages(): Observable<Message[]> {
    return this.lazyLoadRelation('messages');
  }

  get _allMessages(): Observable<any> {
    return Observable.create(function (observer) {
      observer.next(42);
      observer.complete();
    });
  }

}
