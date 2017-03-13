"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var angular2_jsonapi_1 = require('angular2-jsonapi');
var sd = require('./sequence-diagram/models');
var Datastore = (function (_super) {
    __extends(Datastore, _super);
    function Datastore(http) {
        _super.call(this, http);
    }
    Datastore = __decorate([
        core_1.Injectable(),
        angular2_jsonapi_1.JsonApiDatastoreConfig({
            baseUrl: process.env.API_URL + 'api/v1/',
            models: {
                'combined-fragments': sd.CombinedFragment,
                'execution-specifications': sd.ExecutionSpecification,
                'interactions': sd.Interaction,
                'interaction-fragments': sd.InteractionFragment,
                'interaction-operands': sd.InteractionOperand,
                'lifelines': sd.Lifeline,
                'messages': sd.Message,
                'occurrence-specifications': sd.OccurrenceSpecification,
                'layers': sd.Layer
            }
        })
    ], Datastore);
    return Datastore;
}(angular2_jsonapi_1.JsonApiDatastore));
exports.Datastore = Datastore;
//# sourceMappingURL=datastore.js.map