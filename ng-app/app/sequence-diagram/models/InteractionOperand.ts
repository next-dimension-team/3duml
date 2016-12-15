import { JsonApiModel, JsonApiModelConfig, Attribute, BelongsTo } from 'angular2-jsonapi';
import { InteractionFragment } from './InteractionFragment';

@JsonApiModelConfig({
    type: 'interaction-operands'
})
export class InteractionOperand extends JsonApiModel {

  @Attribute()
  name: string;

  @Attribute()
  constraint: string;

  @BelongsTo()
  fragment: InteractionFragment;

}
