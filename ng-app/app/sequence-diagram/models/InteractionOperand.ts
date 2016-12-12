import { JsonApiModelConfig, Attribute, BelongsTo } from 'angular2-jsonapi';
import { InteractionFragment } from './InteractionFragment';
import { BaseJsonApiModel } from './BaseJsonApiModel';
import { Observable } from 'rxjs/Observable';

@JsonApiModelConfig({
    type: 'interaction-operands'
})
export class InteractionOperand extends BaseJsonApiModel {

  @Attribute()
  name: string;

  @Attribute()
  constraint: string;

  @BelongsTo()
  fragment: InteractionFragment;

  get _fragment(): Observable<InteractionFragment> {
    return this.lazyLoadRelation('fragment');
  }

}
