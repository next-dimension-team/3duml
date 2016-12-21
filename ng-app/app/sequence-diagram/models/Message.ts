import { JsonApiModel, JsonApiModelConfig, Attribute, BelongsTo } from 'angular2-jsonapi';
import { OccurrenceSpecification } from './OccurrenceSpecification';
import { Interaction } from './Interaction';

@JsonApiModelConfig({
    type: 'messages'
})
export class Message extends JsonApiModel {

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

}
