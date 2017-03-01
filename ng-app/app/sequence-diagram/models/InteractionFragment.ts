import { JsonApiModel, JsonApiModelConfig, JsonApiDatastore, Attribute, HasMany, BelongsTo } from 'angular2-jsonapi';
import * as M from './';
import * as _ from 'lodash';

@JsonApiModelConfig({
    type: 'interaction-fragments'
})
export class InteractionFragment extends JsonApiModel {

  @Attribute()
  name: string;

  @Attribute()
  created_at: Date;

  @Attribute()
  updated_at: Date;

  @BelongsTo()
  fragmentable: any;

  @BelongsTo()
  parent: InteractionFragment;

  @HasMany({
    key: 'children'
  })
  _children: InteractionFragment[];

  private _childrenKeys: string[];

  constructor(private __datastore: JsonApiDatastore, data?: any) {
    super(__datastore, data);

    if (data && data.relationships) {
      this._childrenKeys = _.map(data.relationships.children.data, 'id');
    }
  }

  public syncRelationships(data: any, included: any, level: number): void {
    // Ak chceme relacie synchronizovat az po vrstvy musime zmenit level
    super.syncRelationships(
      data,
      included,
      _.some(included, { type: 'layers' }) ? -2 : level
    );
  }

  get children(): InteractionFragment[] {
    if (this._children) {
      return this._children;
    }

    return _.map(
      this._childrenKeys,
      (key: string) => this.__datastore.peekRecord(InteractionFragment, key)
    );
  }

  /*
   * Vráti všetky podfragmenty daného typu.
   */
  getRecursiveFragments(fragmentType: string, fragment?: InteractionFragment,
    addCurrent?: boolean): InteractionFragment[] {

    // Začiatok rekurzie súčasným frgmentom
    if (fragment == null) {
      fragment = this;
    }

    // Vytvoríme výsledné pole fragmentov
    let fragments = [];

    // Je súčasný fragment požadovaného typu ?
    if (addCurrent === true && fragment.fragmentable.constructor.name === fragmentType) {
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
  protected getRecursiveMessages(fragment: InteractionFragment): M.Message[] {

    // Vytvoríme výsledné pole správ
    let messages = [];

    // Prejdeme potomkov - fragmenty
    for (let interactionFragment of this.getRecursiveFragments('Interaction', fragment, true)) {
      // Do výsledného poľa správ uložíme správy, ktoré patria do súčasnej interakcie
      messages = messages.concat(interactionFragment.fragmentable.messages);
    }

    return messages;
  }

  get recursiveMessages(): M.Message[] {
    return this.getRecursiveMessages(this);
  }

}
