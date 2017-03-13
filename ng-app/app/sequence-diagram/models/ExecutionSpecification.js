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
var ExecutionSpecification = (function (_super) {
    __extends(ExecutionSpecification, _super);
    function ExecutionSpecification() {
        _super.apply(this, arguments);
    }
    __decorate([
        angular2_jsonapi_1.Attribute()
    ], ExecutionSpecification.prototype, "created_at");
    __decorate([
        angular2_jsonapi_1.Attribute()
    ], ExecutionSpecification.prototype, "updated_at");
    __decorate([
        angular2_jsonapi_1.BelongsTo()
    ], ExecutionSpecification.prototype, "fragment");
    __decorate([
        angular2_jsonapi_1.BelongsTo()
    ], ExecutionSpecification.prototype, "start");
    __decorate([
        angular2_jsonapi_1.BelongsTo()
    ], ExecutionSpecification.prototype, "finish");
    ExecutionSpecification = __decorate([
        angular2_jsonapi_1.JsonApiModelConfig({
            type: 'execution-specifications'
        })
    ], ExecutionSpecification);
    return ExecutionSpecification;
}(angular2_jsonapi_1.JsonApiModel));
exports.ExecutionSpecification = ExecutionSpecification;
//# sourceMappingURL=ExecutionSpecification.js.map