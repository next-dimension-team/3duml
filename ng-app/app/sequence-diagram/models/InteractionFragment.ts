import { JsonApiModelConfig, Attribute, HasMany, BelongsTo } from 'angular2-jsonapi';
import { BaseJsonApiModel } from './BaseJsonApiModel';
import { Observable } from 'rxjs/Observable';

@JsonApiModelConfig({
    type: 'interaction-fragments'
})
export class InteractionFragment extends BaseJsonApiModel {

  @Attribute()
  name: string;

  @BelongsTo()
  fragmentable: any;

  @BelongsTo()
  parent: InteractionFragment;

  @HasMany()
  children: InteractionFragment[];

  get _fragmentable(): Observable<any> {
    return this.lazyLoadRelation('fragmentable');
  }

  get _parent(): Observable<InteractionFragment> {
    return this.lazyLoadRelation('parent');
  }

  get _children(): Observable<InteractionFragment[]> {
    return this.lazyLoadRelation('children');
  }

}
