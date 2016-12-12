import { JsonApiModelConfig, Attribute, BelongsTo, JsonApiDatastore } from 'angular2-jsonapi';
import { OccurrenceSpecification } from './OccurrenceSpecification';
import { Interaction } from './Interaction';
import { BaseJsonApiModel } from './BaseJsonApiModel';
import { Observable } from 'rxjs/Observable';

@JsonApiModelConfig({
    type: 'messages'
})
export class Message extends BaseJsonApiModel {

  @Attribute()
  name: string;

  @Attribute()
  kind: string;

  @Attribute()
  sort: string;

  @BelongsTo()
  interaction: Interaction;

  @BelongsTo()
  sendEvent: OccurrenceSpecification;

  @BelongsTo()
  receiveEvent: OccurrenceSpecification;

  get _interaction(): Observable<Interaction> {
    return this.lazyLoadRelation('interaction');
  }

  get _receiveEvent(): Observable<OccurrenceSpecification> {
    return this.lazyLoadRelation('receiveEvent');
  }

  get _sendEvent(): Observable<OccurrenceSpecification> {
    return this.lazyLoadRelation('sendEvent');
  }

}
