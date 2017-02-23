import 'reflect-metadata';
import { Injectable } from '@angular/core';
import { Datastore } from '../../datastore';
import { JsonApiModel, ModelType } from 'angular2-jsonapi';
import { Observable } from 'rxjs';
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

  // TODO: vrati take interakcie, ktore NEMAJU rodica
  get sequenceDiagrams(): M.Interaction[] {
    let sequenceDiagrams = [];

    for (let interaction of this.datastore.peekAll(M.Interaction)) {
      if (interaction.fragment.parent == null) {
        sequenceDiagrams.push(interaction);
      }
    }

    return sequenceDiagrams;
  }

  getOne<T extends JsonApiModel>(modelType: ModelType<T>, id: string): T {
    return this.datastore.peekRecord(modelType, id);
  }

  getAll<T extends JsonApiModel>(modelType: ModelType<T>): T[] {
    return this.datastore.peekAll(modelType);
  }

}
