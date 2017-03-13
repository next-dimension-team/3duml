"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var SelectableService = (function () {
    function SelectableService() {
        /* Available Events: https://www.w3schools.com/jsref/dom_obj_event.asp */
        /* Left Click - The event occurs when the user clicks on an element */
        this.leftClick = new core_1.EventEmitter;
        /* Right Click - The event occurs when the user right-clicks on an element to open a context menu */
        this.rightClick = new core_1.EventEmitter;
        /* Double Click - The event occurs when the user double-clicks on an element */
        this.doubleClick = new core_1.EventEmitter;
        /* Mouse Over - The event occurs when the pointer is moved onto an element, or onto one of its children */
        this.mouseOver = new core_1.EventEmitter;
        /* Mouse Move - The event occurs when the pointer is moving while it is over an element */
        this.mouseMove = new core_1.EventEmitter;
    }
    SelectableService.prototype.broadcastLeftClick = function (param) {
        this.leftClick.emit(param);
    };
    SelectableService.prototype.onLeftClick = function (callback) {
        this.leftClick.subscribe(callback);
    };
    SelectableService.prototype.broadcastRightClick = function (param) {
        this.rightClick.emit(param);
    };
    SelectableService.prototype.onRightClick = function (callback) {
        this.rightClick.subscribe(callback);
    };
    SelectableService.prototype.broadcastDoubleClick = function (param) {
        this.doubleClick.emit(param);
    };
    SelectableService.prototype.onDoubleClick = function (callback) {
        this.doubleClick.subscribe(callback);
    };
    SelectableService.prototype.broadcastMouseOver = function (param) {
        this.mouseOver.emit(param);
    };
    SelectableService.prototype.onMouseOver = function (callback) {
        this.mouseOver.subscribe(callback);
    };
    SelectableService.prototype.broadcastMouseMove = function (param) {
        this.mouseMove.emit(param);
    };
    SelectableService.prototype.onMouseMove = function (callback) {
        this.mouseMove.subscribe(callback);
    };
    SelectableService = __decorate([
        core_1.Injectable()
    ], SelectableService);
    return SelectableService;
}());
exports.SelectableService = SelectableService;
//# sourceMappingURL=selectable.service.js.map