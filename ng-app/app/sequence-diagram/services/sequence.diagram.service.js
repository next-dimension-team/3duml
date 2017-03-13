"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var rxjs_1 = require('rxjs');
var _ = require('lodash');
var M = require('../models');
var SequenceDiagramService = (function () {
    function SequenceDiagramService(datastore) {
        this.datastore = datastore;
    }
    /*
     * Táto metóda pošle requesty na backend pre všetky entity
     */
    SequenceDiagramService.prototype.loadRecords = function () {
        var _this = this;
        console.log('SequenceDiagramService: Loading records from backend');
        return rxjs_1.Observable.zip(this.datastore.query(M.CombinedFragment), this.datastore.query(M.InteractionFragment), this.datastore.query(M.ExecutionSpecification), this.datastore.query(M.Interaction), this.datastore.query(M.InteractionOperand), this.datastore.query(M.Lifeline), this.datastore.query(M.Message), this.datastore.query(M.OccurrenceSpecification), this.datastore.query(M.Layer), function () {
            _this.synchronizeRelationships();
        });
    };
    /*
     * Vráti pole atribútov zadaného objektu so zadaným dekorátorom
     */
    SequenceDiagramService.prototype.getDecoratedAttributes = function (decoratorName, object) {
        // Inicializuje výsledné pole
        var decoratedAttributes = [];
        // Získa zoznam anotácií
        var annotations = Reflect.getMetadata(decoratorName, object) || [];
        // Prejde všetky anotácie
        for (var _i = 0, annotations_1 = annotations; _i < annotations_1.length; _i++) {
            var annotation = annotations_1[_i];
            // Pridá atribút do výsledného poľa
            decoratedAttributes.push(annotation.propertyName);
        }
        return decoratedAttributes;
    };
    /*
     * Vráti načítanú inštanciu rovnakého modelu,
     * ktorý dostane ako vstupný parameter.
     */
    SequenceDiagramService.prototype.peekModel = function (modelInstance) {
        if (!modelInstance) {
            return null;
        }
        var modelType = modelInstance.constructor;
        var modelId = modelInstance.id;
        return this.datastore.peekRecord(modelType, modelId);
    };
    /*
     * Synchronizuje vzťahy všetkých načítaných modelov.
     */
    SequenceDiagramService.prototype.synchronizeRelationships = function () {
        // Prejde všetky typy modelov
        for (var _i = 0, _a = SequenceDiagramService.modelTypes; _i < _a.length; _i++) {
            var modelType = _a[_i];
            // Inicializácia bufferovacích polí
            var hasManyAttributes = null;
            var belongsToAttributes = null;
            // Získame inštancie modelov daného typu
            var modelInstances = this.datastore.peekAll(modelType);
            // Prejdeme všetky inštancie modelu daného typu
            for (var _b = 0, modelInstances_1 = modelInstances; _b < modelInstances_1.length; _b++) {
                var modelInstance = modelInstances_1[_b];
                // Získame zoznam atribútov s dekorátorom 'HasMany'
                if (!hasManyAttributes) {
                    hasManyAttributes = this.getDecoratedAttributes('HasMany', modelInstance);
                }
                // Získame zoznam atribútov s dekorátorom 'BelongsTo'
                if (!belongsToAttributes) {
                    belongsToAttributes = this.getDecoratedAttributes('BelongsTo', modelInstance);
                }
                // Synchronizujeme "HasMany" vzťahy
                for (var _c = 0, hasManyAttributes_1 = hasManyAttributes; _c < hasManyAttributes_1.length; _c++) {
                    var attribute = hasManyAttributes_1[_c];
                    // Existuje nenačítaný vzťah?
                    if (modelInstance[attribute]) {
                        // Vytvoríme prázdne pole, kam si neskôr uložíme načítané modely
                        var peekedModels = [];
                        // Prejdeme nenačítané modely
                        for (var _d = 0, _e = modelInstance[attribute]; _d < _e.length; _d++) {
                            var nonPeekedModel = _e[_d];
                            // Získame inštanciu načítaného modelu a zapamätáme si ju
                            var peekedModel = this.peekModel(nonPeekedModel);
                            peekedModels.push(peekedModel);
                        }
                        // Pole nenačítaných modelov nahradíme polom načítaných modelov
                        modelInstance[attribute] = peekedModels;
                    }
                    else {
                        // Vzťah nebol načítaný
                        modelInstance[attribute] = [];
                    }
                }
                // Synchronizujeme "BelongsTo" vzťahy
                for (var _f = 0, belongsToAttributes_1 = belongsToAttributes; _f < belongsToAttributes_1.length; _f++) {
                    var attribute = belongsToAttributes_1[_f];
                    // Existuje nenačítaný vzťah?
                    if (modelInstance[attribute]) {
                        // Načítame inštanciu modelu relácie
                        modelInstance[attribute] = this.peekModel(modelInstance[attribute]);
                    }
                    else {
                        // Vzťah nebol načítaný
                        modelInstance[attribute] = null;
                    }
                }
            }
        }
    };
    SequenceDiagramService.prototype.getSequenceDiagrams = function () {
        return this.datastore.query(M.InteractionFragment, {
            include: 'fragmentable',
            filter: {
                roots: 1
            }
        }).map(function (fragments) { return _.map(fragments, 'fragmentable'); });
    };
    SequenceDiagramService.prototype.loadSequenceDiagramTree = function (interaction) {
        var id = interaction.fragment.id;
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
        }).map(function (fragments) { return _.find(fragments, ['id', id]).fragmentable; });
    };
    SequenceDiagramService.prototype.getOne = function (modelType, id) {
        return this.datastore.peekRecord(modelType, id);
    };
    SequenceDiagramService.prototype.getAll = function (modelType) {
        return this.datastore.peekAll(modelType);
    };
    SequenceDiagramService.prototype.createMessage = function (fromEvent, fromLifelineModel, toEvent, toLifelineModel, callback) {
        var _this = this;
        var sourceOccurence = this.datastore.createRecord(M.OccurrenceSpecification, {
            time: (Math.round(fromEvent.offsetY / 40)) * 40,
            covered: this.getOne(M.Lifeline, fromLifelineModel.id)
        });
        sourceOccurence.save().subscribe(callback);
        sourceOccurence.save().subscribe(function (sourceOccurence) {
            var destinationOccurence = _this.datastore.createRecord(M.OccurrenceSpecification, {
                //TODO: bude len /40
                time: (Math.round(toEvent.offsetY / 40)) * 40,
                covered: _this.getOne(M.Lifeline, toLifelineModel.id)
            });
            destinationOccurence.save().subscribe(function (destinationOccurence) {
                var message = _this.datastore.createRecord(M.Message, {
                    //TODO nazvat message ako chcem
                    name: "send",
                    sort: "synchCall",
                    //TODO zmenit dynamicky na interaction, v ktorom realne som
                    interaction: _this.getOne(M.Interaction, "1"),
                    sendEvent: sourceOccurence,
                    receiveEvent: destinationOccurence
                });
                message.save().subscribe(callback);
            });
        });
    };
    SequenceDiagramService.modelTypes = [
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
    SequenceDiagramService = __decorate([
        core_1.Injectable()
    ], SequenceDiagramService);
    return SequenceDiagramService;
}());
exports.SequenceDiagramService = SequenceDiagramService;
//# sourceMappingURL=sequence.diagram.service.js.map