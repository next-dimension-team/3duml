import { JsonApiModelConfig, JsonApiModel, Attribute, HasMany, BelongsTo } from 'angular2-jsonapi';
import { InteractionFragment } from './InteractionFragment';
import { Message } from './Message';

@JsonApiModelConfig({
    type: 'Interaction'
})
export class Interaction extends JsonApiModel {

  @Attribute()
  name: string;

  @BelongsTo()
  fragment: InteractionFragment;

  @HasMany()
  messages: Message[];

}
