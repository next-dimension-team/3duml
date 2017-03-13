import { JsonApiModel, JsonApiModelConfig, Attribute, HasMany, BelongsTo } from 'angular2-jsonapi';
import { OccurrenceSpecification } from './OccurrenceSpecification';
import * as M from './';

@JsonApiModelConfig({
    type: 'lifelines'
})
export class Lifeline extends JsonApiModel {

  @Attribute()
  name: string;

  @Attribute()
  order: number;  

  @Attribute()
  created_at: Date;

  @Attribute()
  updated_at: Date;

  @BelongsTo()
  interaction: M.Interaction;

  @HasMany()
  occurrenceSpecifications: M.OccurrenceSpecification[] = [];

  // TODO: neodskúšaná metóda
  get interactions(): M.Interaction[] {
    let interactions = [];

    let addInteraction = (interaction: M.Interaction) => {
      if (interactions.indexOf(interaction) === -1) {
        interactions.push(interaction);
      }
    };

    for (let occurrenceSpecification of this.occurrenceSpecifications) {
      for (let message of occurrenceSpecification.sendingEventMessages) {
        addInteraction(message.interaction);
      }

      for (let message of occurrenceSpecification.receivingEventMessages) {
        addInteraction(message.interaction);
      }
    }

    return interactions;
  }

  protected _leftDistance: number = 0;
  // TODO: toto by možno malo byť implementované inde (inak ?)
  /*
   * Vracia vzdialenosť lifeliny z ľavej strany plátna.
   */
  get leftDistance(): number {
    return this._leftDistance;
  }

  set leftDistance(leftDistance) {
    this._leftDistance = leftDistance;
  }

}
