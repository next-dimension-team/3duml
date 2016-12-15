import { JsonApiModel, JsonApiModelConfig, Attribute, HasMany, BelongsTo } from 'angular2-jsonapi';
import * as M from './';

@JsonApiModelConfig({
    type: 'interactions'
})
export class Interaction extends JsonApiModel {

  @Attribute()
  name: string;

  @BelongsTo()
  fragment: M.InteractionFragment;

  @HasMany()
  messages: M.Message[];

  /*
   * Implementácia virtuálneho vzťahu medzi interakciou a lifelinami
   */
  get lifelines(): M.Lifeline[] {
    let lifelinesBuffer = [];

    let processLifeline = (lifeline: M.Lifeline) => {
      if (lifeline) {
        lifelinesBuffer[parseInt(lifeline.id)] = lifeline;
      }
    };

    // Prejdeme všetky messages v danej interakcii
    for (let message of this.messages) {
      let messageSendEvent = message.sendEvent;
      let messageReceiveEvent = message.receiveEvent;

      if (messageSendEvent) {
        processLifeline(messageSendEvent.covered);
      }

      if (messageReceiveEvent) {
        processLifeline(messageSendEvent.covered);
      }
    }

    let lifelines = [];

    for (let lifeline of lifelinesBuffer) {
      if (lifeline) {
        lifelines.push(lifeline);
      }
    }

    return lifelines;
  }

}
