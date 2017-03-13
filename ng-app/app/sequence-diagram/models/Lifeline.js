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
var angular2_jsonapi_1 = require('angular2-jsonapi');
var Lifeline = (function (_super) {
    __extends(Lifeline, _super);
    function Lifeline() {
        _super.apply(this, arguments);
        this._leftDistance = 0;
    }
    Object.defineProperty(Lifeline.prototype, "interactions", {
        // TODO: neodskúšaná metóda
        get: function () {
            var interactions = [];
            var addInteraction = function (interaction) {
                if (interactions.indexOf(interaction) === -1) {
                    interactions.push(interaction);
                }
            };
            for (var _i = 0, _a = this.occurrenceSpecifications; _i < _a.length; _i++) {
                var occurrenceSpecification = _a[_i];
                for (var _b = 0, _c = occurrenceSpecification.sendingEventMessages; _b < _c.length; _b++) {
                    var message = _c[_b];
                    addInteraction(message.interaction);
                }
                for (var _d = 0, _e = occurrenceSpecification.receivingEventMessages; _d < _e.length; _d++) {
                    var message = _e[_d];
                    addInteraction(message.interaction);
                }
            }
            return interactions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Lifeline.prototype, "leftDistance", {
        // TODO: toto by možno malo byť implementované inde (inak ?)
        /*
         * Vracia vzdialenosť lifeliny z ľavej strany plátna.
         */
        get: function () {
            return this._leftDistance;
        },
        set: function (leftDistance) {
            this._leftDistance = leftDistance;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        angular2_jsonapi_1.Attribute()
    ], Lifeline.prototype, "name");
    __decorate([
        angular2_jsonapi_1.Attribute()
    ], Lifeline.prototype, "created_at");
    __decorate([
        angular2_jsonapi_1.Attribute()
    ], Lifeline.prototype, "updated_at");
    __decorate([
        angular2_jsonapi_1.HasMany()
    ], Lifeline.prototype, "occurrenceSpecifications");
    __decorate([
        angular2_jsonapi_1.BelongsTo()
    ], Lifeline.prototype, "layer");
    Lifeline = __decorate([
        angular2_jsonapi_1.JsonApiModelConfig({
            type: 'lifelines'
        })
    ], Lifeline);
    return Lifeline;
}(angular2_jsonapi_1.JsonApiModel));
exports.Lifeline = Lifeline;
//# sourceMappingURL=Lifeline.js.map