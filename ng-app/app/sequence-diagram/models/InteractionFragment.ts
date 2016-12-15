import { JsonApiModel, JsonApiModelConfig, Attribute, HasMany, BelongsTo } from 'angular2-jsonapi';
import * as M from './';

@JsonApiModelConfig({
    type: 'interaction-fragments'
})
export class InteractionFragment extends JsonApiModel {

  @Attribute()
  name: string;

  @BelongsTo()
  fragmentable: any;

  @BelongsTo()
  parent: InteractionFragment;

  @HasMany()
  children: InteractionFragment[];

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
    return this.getRecursiveMessages(this);
  }

}
