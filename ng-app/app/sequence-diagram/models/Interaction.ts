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
   * Vráti všetky správy danej interakcie a jej potomkov.
   */
  protected getRecursiveMessages(fragment: M.InteractionFragment): M.Message[] {

    // Vytvoríme výsledné pole správ
    let messages = [];

    // Je súčasný fragment interakcia ?
    if (fragment.fragmentable.constructor.name == "Interaction") {

      // Do výsledného poľa správ uložíme správy, ktoré patria do súčasnej interakcie
      messages = messages.concat(fragment.fragmentable.messages);
    }

    // Prejdeme potomkov - fragmenty
    for (let childFragment of fragment.children) {
      messages = messages.concat(this.getRecursiveMessages(childFragment));
    }

    return messages;
  }

  get recursiveMessages(): M.Message[] {
    return this.getRecursiveMessages(this.fragment);
  }

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
