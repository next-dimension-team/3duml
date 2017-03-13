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
var Interaction = (function (_super) {
    __extends(Interaction, _super);
    function Interaction() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(Interaction.prototype, "recursiveMessages", {
        get: function () {
            return this.fragment.recursiveMessages;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Interaction.prototype, "lifelines", {
        /*
         * Implementácia virtuálneho vzťahu medzi interakciou a lifelinami
         */
        get: function () {
            var lifelinesBuffer = [];
            var processLifeline = function (lifeline) {
                if (lifeline) {
                    lifelinesBuffer[parseInt(lifeline.id, 10)] = lifeline;
                }
            };
            // Prejdeme všetky messages v danej interakcii
            for (var _i = 0, _a = this.messages; _i < _a.length; _i++) {
                var message = _a[_i];
                var messageSendEvent = message.sendEvent;
                var messageReceiveEvent = message.receiveEvent;
                if (messageSendEvent) {
                    processLifeline(messageSendEvent.covered);
                }
                if (messageReceiveEvent) {
                    processLifeline(messageReceiveEvent.covered);
                }
            }
            var lifelines = [];
            for (var _b = 0, lifelinesBuffer_1 = lifelinesBuffer; _b < lifelinesBuffer_1.length; _b++) {
                var lifeline = lifelinesBuffer_1[_b];
                if (lifeline) {
                    lifelines.push(lifeline);
                }
            }
            return lifelines;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        angular2_jsonapi_1.Attribute()
    ], Interaction.prototype, "name");
    __decorate([
        angular2_jsonapi_1.Attribute()
    ], Interaction.prototype, "created_at");
    __decorate([
        angular2_jsonapi_1.Attribute()
    ], Interaction.prototype, "updated_at");
    __decorate([
        angular2_jsonapi_1.BelongsTo()
    ], Interaction.prototype, "fragment");
    __decorate([
        angular2_jsonapi_1.HasMany()
    ], Interaction.prototype, "messages");
    Interaction = __decorate([
        angular2_jsonapi_1.JsonApiModelConfig({
            type: 'interactions'
        })
    ], Interaction);
    return Interaction;
}(angular2_jsonapi_1.JsonApiModel));
exports.Interaction = Interaction;
//# sourceMappingURL=Interaction.js.map