import { JsonApiModel, JsonApiModelConfig, Attribute, BelongsTo } from '../../../jsonapi';
import { InteractionFragment } from './InteractionFragment';

@JsonApiModelConfig({
    type: 'combined-fragments'
})
export class CombinedFragment extends JsonApiModel {

  @Attribute()
  name: string;

  @Attribute()
  operator: string;

  @Attribute()
  created_at: Date;

  @Attribute()
  updated_at: Date;

  @BelongsTo()
  fragment: InteractionFragment;

}
