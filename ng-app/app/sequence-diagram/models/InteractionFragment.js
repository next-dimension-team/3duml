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
var _ = require('lodash');
var InteractionFragment = (function (_super) {
    __extends(InteractionFragment, _super);
    function InteractionFragment(__datastore, data) {
        _super.call(this, __datastore, data);
        this.__datastore = __datastore;
        if (data && data.relationships) {
            this._childrenKeys = _.map(data.relationships.children.data, 'id');
        }
    }
    InteractionFragment.prototype.syncRelationships = function (data, included, level) {
        // Ak chceme relacie synchronizovat az po vrstvy musime zmenit level
        _super.prototype.syncRelationships.call(this, data, included, _.some(included, { type: 'layers' }) ? -2 : level);
    };
    Object.defineProperty(InteractionFragment.prototype, "children", {
        get: function () {
            var _this = this;
            if (this._children) {
                return this._children;
            }
            return _.map(this._childrenKeys, function (key) { return _this.__datastore.peekRecord(InteractionFragment, key); });
        },
        enumerable: true,
        configurable: true
    });
    /*
     * Vráti všetky podfragmenty daného typu.
     */
    InteractionFragment.prototype.getRecursiveFragments = function (fragmentType, fragment, addCurrent) {
        // Začiatok rekurzie súčasným frgmentom
        if (fragment == null) {
            fragment = this;
        }
        // Vytvoríme výsledné pole fragmentov
        var fragments = [];
        // Je súčasný fragment požadovaného typu ?
        if (addCurrent === true && fragment.fragmentable.constructor.name === fragmentType) {
            fragments.push(fragment);
        }
        // Prejdeme potomkov - fragmenty
        for (var _i = 0, _a = fragment.children; _i < _a.length; _i++) {
            var childFragment = _a[_i];
            fragments = fragments.concat(this.getRecursiveFragments(fragmentType, childFragment, true));
        }
        return fragments;
    };
    /*
     * Vráti všetky správy danej interakcie a jej potomkov.
     */
    InteractionFragment.prototype.getRecursiveMessages = function (fragment) {
        // Vytvoríme výsledné pole správ
        var messages = [];
        // Prejdeme potomkov - fragmenty
        for (var _i = 0, _a = this.getRecursiveFragments('Interaction', fragment, true); _i < _a.length; _i++) {
            var interactionFragment = _a[_i];
            // Do výsledného poľa správ uložíme správy, ktoré patria do súčasnej interakcie
            messages = messages.concat(interactionFragment.fragmentable.messages);
        }
        return messages;
    };
    Object.defineProperty(InteractionFragment.prototype, "recursiveMessages", {
        get: function () {
            return this.getRecursiveMessages(this);
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        angular2_jsonapi_1.Attribute()
    ], InteractionFragment.prototype, "name");
    __decorate([
        angular2_jsonapi_1.Attribute()
    ], InteractionFragment.prototype, "created_at");
    __decorate([
        angular2_jsonapi_1.Attribute()
    ], InteractionFragment.prototype, "updated_at");
    __decorate([
        angular2_jsonapi_1.BelongsTo()
    ], InteractionFragment.prototype, "fragmentable");
    __decorate([
        angular2_jsonapi_1.BelongsTo()
    ], InteractionFragment.prototype, "parent");
    __decorate([
        angular2_jsonapi_1.HasMany({
            key: 'children'
        })
    ], InteractionFragment.prototype, "_children");
    InteractionFragment = __decorate([
        angular2_jsonapi_1.JsonApiModelConfig({
            type: 'interaction-fragments'
        })
    ], InteractionFragment);
    return InteractionFragment;
}(angular2_jsonapi_1.JsonApiModel));
exports.InteractionFragment = InteractionFragment;
//# sourceMappingURL=InteractionFragment.js.map