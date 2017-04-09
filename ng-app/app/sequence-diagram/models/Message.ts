import { JsonApiModel, JsonApiModelConfig, Attribute, BelongsTo } from 'angular2-jsonapi';
import { OccurrenceSpecification } from './OccurrenceSpecification';
import { Interaction } from './Interaction';

@JsonApiModelConfig({
  type: 'messages'
})
export class Message extends JsonApiModel {

  @Attribute()
  public name: string;

  @Attribute()
  public kind: string;

  @Attribute()
  public sort: string;

  @Attribute()
  public created_at: Date;

  @Attribute()
  public updated_at: Date;

  @BelongsTo()
  public interaction: Interaction;

  @BelongsTo()
  public sendEvent: OccurrenceSpecification;

  @BelongsTo()
  public receiveEvent: OccurrenceSpecification;

}
