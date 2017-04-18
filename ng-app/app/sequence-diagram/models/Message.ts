import { JsonApiModel, JsonApiModelConfig, Attribute, BelongsTo } from '../../../jsonapi';
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

  @Attribute()
  created_at: Date;

  @Attribute()
  updated_at: Date;

  @BelongsTo()
  interaction: Interaction;

  @BelongsTo()
  sendEvent: OccurrenceSpecification;

  @BelongsTo()
  receiveEvent: OccurrenceSpecification;

}
