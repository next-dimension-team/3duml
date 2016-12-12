import { JsonApiModelConfig, Attribute, BelongsTo } from 'angular2-jsonapi';
import { InteractionFragment } from './InteractionFragment';
import { OccurrenceSpecification } from './OccurrenceSpecification';
import { BaseJsonApiModel } from './BaseJsonApiModel';
import { Observable } from 'rxjs/Observable';

@JsonApiModelConfig({
    type: 'execution-specifications'
})
export class ExecutionSpecification extends BaseJsonApiModel {

  @Attribute()
  name: string;

  @BelongsTo()
  fragment: InteractionFragment;

  @BelongsTo()
  start: OccurrenceSpecification;

  @BelongsTo()
  finish: OccurrenceSpecification;

  get _fragment(): Observable<InteractionFragment> {
    return this.lazyLoadRelation('fragment');
  }

  get _start(): Observable<OccurrenceSpecification> {
    return this.lazyLoadRelation('start');
  }

  get _finish(): Observable<OccurrenceSpecification> {
    return this.lazyLoadRelation('finish');
  }

}
