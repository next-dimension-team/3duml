import { JsonApiModel, JsonApiModelConfig, Attribute, BelongsTo } from 'angular2-jsonapi';
import { InteractionFragment } from './InteractionFragment';

@JsonApiModelConfig({
  type: 'interaction-operands'
})
export class InteractionOperand extends JsonApiModel {

  @Attribute()
  public name: string;

  @Attribute()
  public constraint: string;

  @Attribute()
  public created_at: Date;

  @Attribute()
  public updated_at: Date;

  @BelongsTo()
  public fragment: InteractionFragment;

}
