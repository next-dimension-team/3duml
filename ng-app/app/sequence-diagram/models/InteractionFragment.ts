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
   * Vráti všetky podfragmenty daného typu.
   */
  getRecursiveFragments(fragmentType: string, fragment?: M.InteractionFragment, addCurrent?: boolean): M.InteractionFragment[] {
    
    // Začiatok rekurzie súčasným frgmentom
    if (fragment == null) {
      fragment = this;
    }

    // Vytvoríme výsledné pole fragmentov
    let fragments = [];

    // Je súčasný fragment požadovaného typu ?
    if (addCurrent == true && fragment.fragmentable.constructor.name == fragmentType) {
      fragments.push(fragment);
    }

    // Prejdeme potomkov - fragmenty
    for (let childFragment of fragment.children) {
      fragments = fragments.concat(this.getRecursiveFragments(fragmentType, childFragment, true));
    }

    return fragments;
  }

  /*
   * Vráti všetky správy danej interakcie a jej potomkov.
   */
  protected getRecursiveMessages(fragment: M.InteractionFragment): M.Message[] {

    // Vytvoríme výsledné pole správ
    let messages = [];

    // Prejdeme potomkov - fragmenty
    for (let interactionFragment of this.getRecursiveFragments("Interaction", fragment, true)) {
      
      // Do výsledného poľa správ uložíme správy, ktoré patria do súčasnej interakcie
      messages = messages.concat(interactionFragment.fragmentable.messages);
    }

    return messages;
  }

  get recursiveMessages(): M.Message[] {
    return this.getRecursiveMessages(this);
  }

}
