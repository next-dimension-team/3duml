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

  @Attribute()
  created_at: Date;

  @Attribute()
  updated_at: Date;

  @BelongsTo()
  fragment: InteractionFragment;

}
