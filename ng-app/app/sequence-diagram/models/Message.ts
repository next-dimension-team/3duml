import { JsonApiModelConfig, JsonApiModel, Attribute, BelongsTo, JsonApiDatastore } from 'angular2-jsonapi';
import { OccurrenceSpecification } from './OccurrenceSpecification';
import { Interaction } from './Interaction';
import { Datastore } from '../../datastore';

@JsonApiModelConfig({
    type: 'messages'
})
export class Message extends JsonApiModel {

  protected datastore: JsonApiDatastore;

  constructor(_datastore: JsonApiDatastore, data?: any) {
    super(_datastore, data);
    this.datastore = _datastore;
  }

  @Attribute()
  name: string;

  @Attribute()
  kind: string;

  @Attribute()
  sort: string;

  @BelongsTo()
  interaction: Interaction;

  @BelongsTo()
  sendEvent: OccurrenceSpecification;

  @BelongsTo()
  receiveEvent: OccurrenceSpecification;

  public withRelationships(): Promise<Message> {
    return this.datastore.findRecord(Message, this.id).toPromise();
  }

}
