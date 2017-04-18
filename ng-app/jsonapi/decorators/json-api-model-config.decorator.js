"use strict";
function JsonApiModelConfig(config) {
    if (config === void 0) { config = {}; }
    return function (target) {
        Reflect.defineMetadata('JsonApiModelConfig', config, target);
    };
}
exports.JsonApiModelConfig = JsonApiModelConfig;
//# sourceMappingURL=json-api-model-config.decorator.js.map