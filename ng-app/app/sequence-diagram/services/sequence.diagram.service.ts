import { Injectable } from '@angular/core';
import { Datastore } from '../../datastore';
import { JsonApiModel, ModelType } from 'angular2-jsonapi';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import * as M from '../models';

@Injectable()
export class SequenceDiagramService {

  public static modelTypes = [
    M.CombinedFragment,
    M.InteractionFragment,
    M.ExecutionSpecification,
    M.Interaction,
    M.InteractionOperand,
    M.Lifeline,
    M.Message,
    M.OccurrenceSpecification,
    M.Layer
  ];

  constructor(private datastore: Datastore) { }

  /*
   * Táto metóda pošle requesty na backend pre všetky entity
   */
  public loadRecords(): Observable<any> {
    console.log('SequenceDiagramService: Loading records from backend');
    return Observable.zip(
      this.datastore.query(M.CombinedFragment),
      this.datastore.query(M.InteractionFragment),
      this.datastore.query(M.ExecutionSpecification),
      this.datastore.query(M.Interaction),
      this.datastore.query(M.InteractionOperand),
      this.datastore.query(M.Lifeline),
      this.datastore.query(M.Message),
      this.datastore.query(M.OccurrenceSpecification),
      this.datastore.query(M.Layer),
      () => {
        this.synchronizeRelationships();
      }
    );
  }

  /*
   * Vráti pole atribútov zadaného objektu so zadaným dekorátorom
   */
  protected getDecoratedAttributes(decoratorName: string, object): string[] {

    // Inicializuje výsledné pole
    let decoratedAttributes = [];

    // Získa zoznam anotácií
    let annotations = Reflect.getMetadata(decoratorName, object) || [];

    // Prejde všetky anotácie
    for (let annotation of annotations) {

      // Pridá atribút do výsledného poľa
      decoratedAttributes.push(annotation.propertyName);
    }

    return decoratedAttributes;
  }

  /*
   * Vráti načítanú inštanciu rovnakého modelu,
   * ktorý dostane ako vstupný parameter.
   */
  protected peekModel(modelInstance) {
    if (!modelInstance) {
      return null;
    }

    const modelType = modelInstance.constructor;
    const modelId = modelInstance.id;

    return this.datastore.peekRecord(modelType, modelId);
  }

  /*
   * Synchronizuje vzťahy všetkých načítaných modelov.
   */
  protected synchronizeRelationships() {

    // Prejde všetky typy modelov
    for (let modelType of SequenceDiagramService.modelTypes) {

      // Inicializácia bufferovacích polí
      let hasManyAttributes = null;
      let belongsToAttributes = null;

      // Získame inštancie modelov daného typu
      let modelInstances = this.datastore.peekAll<JsonApiModel>(modelType);

      // Prejdeme všetky inštancie modelu daného typu
      for (let modelInstance of modelInstances) {

        // Získame zoznam atribútov s dekorátorom 'HasMany'
        if (!hasManyAttributes) {
          hasManyAttributes = this.getDecoratedAttributes('HasMany', modelInstance);
        }

        // Získame zoznam atribútov s dekorátorom 'BelongsTo'
        if (!belongsToAttributes) {
          belongsToAttributes = this.getDecoratedAttributes('BelongsTo', modelInstance);
        }

        // Synchronizujeme "HasMany" vzťahy
        for (let attribute of hasManyAttributes) {

          // Existuje nenačítaný vzťah?
          if (modelInstance[attribute]) {

            // Vytvoríme prázdne pole, kam si neskôr uložíme načítané modely
            let peekedModels = [];

            // Prejdeme nenačítané modely
            for (let nonPeekedModel of modelInstance[attribute]) {
              // Získame inštanciu načítaného modelu a zapamätáme si ju
              let peekedModel = this.peekModel(nonPeekedModel);
              peekedModels.push(peekedModel);
            }

            // Pole nenačítaných modelov nahradíme polom načítaných modelov
            modelInstance[attribute] = peekedModels;
          } else {
            // Vzťah nebol načítaný
            modelInstance[attribute] = [];
            // console.error(`Could not peek HasMany model relation with name
            // ${attribute} for model type ${modelInstance.constructor.name}.`);
          }
        }

        // Synchronizujeme "BelongsTo" vzťahy
        for (let attribute of belongsToAttributes) {
          // Existuje nenačítaný vzťah?
          if (modelInstance[attribute]) {
            // Načítame inštanciu modelu relácie
            modelInstance[attribute] = this.peekModel(modelInstance[attribute]);
          } else {
            // Vzťah nebol načítaný
            modelInstance[attribute] = null;
            // console.error(`Could not peek BelongsTo model relation with name
            // ${attribute} for model type ${modelInstance.constructor.name}.`);
          }
        }

      }
    }
  }

  public getSequenceDiagrams(): Observable<M.Interaction[]> {
    return this.datastore.query(M.InteractionFragment, {
      include: 'fragmentable',
      filter: {
        roots: 1
      }
    }).map(
      (fragments: M.InteractionFragment[]) => _.map(fragments, 'fragmentable')
    );
  }

  public loadSequenceDiagramTree(interaction: M.Interaction): Observable<M.Interaction> {
    let id = interaction.fragment.id;

    return this.datastore.query(M.InteractionFragment, {
      include: _.join([
        'fragmentable.messages.sendEvent.covered.layer',
        'fragmentable.messages.receiveEvent.covered.layer',
        'fragmentable.start.covered.layer',
        'fragmentable.finish.covered.layer'
      ]),
      filter: {
        descendants: id
      }
    }).map(
      (fragments: M.InteractionFragment[]) => _.find(fragments, ['id', id]).fragmentable
    );
  }

  getOne<T extends JsonApiModel>(modelType: ModelType<T>, id: string): T {
    return this.datastore.peekRecord(modelType, id);
  }

  getAll<T extends JsonApiModel>(modelType: ModelType<T>): T[] {
    return this.datastore.peekAll(modelType);
  }

  public createDiagram(name: string, callback: any) {
    let interaction = this.datastore.createRecord(M.Interaction, {
      name: name
    });

    interaction.save().subscribe((interaction: M.Interaction) => {
      let interactionFragment = this.datastore.createRecord(M.InteractionFragment, {
        fragmentable: interaction
      });

      interactionFragment.save().subscribe(callback);
    });
  }

}
