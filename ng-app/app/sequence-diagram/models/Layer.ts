import { JsonApiModel, JsonApiModelConfig, Attribute, HasMany } from 'angular2-jsonapi';
import { Lifeline } from './Lifeline';

@JsonApiModelConfig({
    type: 'layers'
})
export class Layer extends JsonApiModel {

  @Attribute()
  depth: number;

  @HasMany()
  lifelines: Lifeline[];

}
