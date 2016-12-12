import { JsonApiModelConfig, Attribute, BelongsTo } from 'angular2-jsonapi';
import { InteractionFragment } from './InteractionFragment';
import { BaseJsonApiModel } from './BaseJsonApiModel';
import { Observable } from 'rxjs/Observable';

@JsonApiModelConfig({
    type: 'combined-fragments'
})
export class CombinedFragment extends BaseJsonApiModel {

  @Attribute()
  name: string;

  @Attribute()
  operator: string;

  @BelongsTo()
  fragment: InteractionFragment;

  get _fragment(): Observable<InteractionFragment> {
    return this.lazyLoadRelation('fragment');
  }

}
