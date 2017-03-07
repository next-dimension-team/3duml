import { JsonApiModel, JsonApiModelConfig, Attribute, HasMany, BelongsTo } from 'angular2-jsonapi';
import * as M from './';

@JsonApiModelConfig({
    type: 'interactions'
})
export class Interaction extends JsonApiModel {

  @Attribute()
  name: string;

  @Attribute()
  created_at: Date;

  @Attribute()
  updated_at: Date;

  @BelongsTo()
  fragment: M.InteractionFragment;

  @HasMany()
  messages: M.Message[];

  get isRootInteraction() {
    return (! this.fragment.parent);
  }

  get isLayerInteraction() {
    let parent = this.fragment.parent;
    return (parent && parent.isRootInteraction);
  }

  get isBasicInteraction() {
    return (! this.isRootInteraction && ! this.isLayerInteraction);
  }

  get recursiveMessages(): M.Message[] {
    return this.fragment.recursiveMessages;
  }

  /*
   * Implementácia virtuálneho vzťahu medzi interakciou a lifelinami
   */
  get lifelines(): M.Lifeline[] {
    if (! this.messages) {
      return [];
    }

    let lifelinesBuffer = [];

    let processLifeline = (lifeline: M.Lifeline) => {
      if (lifeline) {
        lifelinesBuffer[parseInt(lifeline.id, 10)] = lifeline;
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
        processLifeline(messageReceiveEvent.covered);
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

  /*
   * Implementácia virtuálneho vzťahu medzi interakciou a lifelinami
   */
  get recursiveLifelines(): M.Lifeline[] {
    if (! this.recursiveMessages) {
      return [];
    }

    let lifelinesBuffer = [];

    let processLifeline = (lifeline: M.Lifeline) => {
      if (lifeline) {
        lifelinesBuffer[parseInt(lifeline.id, 10)] = lifeline;
      }
    };

    // Prejdeme všetky messages v danej interakcii
    for (let message of this.recursiveMessages) {
      let messageSendEvent = message.sendEvent;
      let messageReceiveEvent = message.receiveEvent;

      if (messageSendEvent) {
        processLifeline(messageSendEvent.covered);
      }

      if (messageReceiveEvent) {
        processLifeline(messageReceiveEvent.covered);
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
