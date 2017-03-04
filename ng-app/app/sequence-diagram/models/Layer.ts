import { JsonApiModel, JsonApiModelConfig, Attribute, HasMany } from 'angular2-jsonapi';
import { Lifeline } from './Lifeline';

@JsonApiModelConfig({
    type: 'layers'
})
export class Layer extends JsonApiModel {

  @Attribute()
  depth: number;

  @Attribute()
  created_at: Date;

  @Attribute()
  updated_at: Date;

  @HasMany()
  lifelines: Lifeline[];

}
