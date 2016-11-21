import { JsonApiModelConfig, JsonApiModel, Attribute, BelongsTo } from 'angular2-jsonapi';
import { InteractionFragment } from './InteractionFragment';

@JsonApiModelConfig({
    type: 'combined-fragments'
})
export class CombinedFragment extends JsonApiModel {

  @Attribute()
  name: string;

  @Attribute()
  operator: string;

  @BelongsTo()
  fragment: InteractionFragment;

}
