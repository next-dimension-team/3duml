import { JsonApiModel, JsonApiModelConfig, Attribute, HasMany, BelongsTo } from 'angular2-jsonapi';

@JsonApiModelConfig({
    type: 'interaction-fragments'
})
export class InteractionFragment extends JsonApiModel {

  @Attribute()
  name: string;

  @BelongsTo()
  fragmentable: any;

  @BelongsTo()
  parent: InteractionFragment;

  @HasMany()
  children: InteractionFragment[];

}
