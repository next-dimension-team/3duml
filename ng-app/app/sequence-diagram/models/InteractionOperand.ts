import { JsonApiModelConfig, JsonApiModel, Attribute, BelongsTo } from 'angular2-jsonapi';
import { InteractionFragment } from './InteractionFragment';

@JsonApiModelConfig({
    type: 'InteractionOperand'
})
export class InteractionOperand extends JsonApiModel {

  @Attribute()
  name: string;

  @Attribute()
  constraint: string;

  @BelongsTo()
  fragment: InteractionFragment;

}
