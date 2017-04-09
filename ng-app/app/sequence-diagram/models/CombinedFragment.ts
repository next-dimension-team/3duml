import { JsonApiModel, JsonApiModelConfig, Attribute, BelongsTo } from 'angular2-jsonapi';
import { InteractionFragment } from './InteractionFragment';

@JsonApiModelConfig({
  type: 'combined-fragments'
})
export class CombinedFragment extends JsonApiModel {

  @Attribute()
  public name: string;

  @Attribute()
  public operator: string;

  @Attribute()
  public created_at: Date;

  @Attribute()
  public updated_at: Date;

  @BelongsTo()
  public fragment: InteractionFragment;

}
