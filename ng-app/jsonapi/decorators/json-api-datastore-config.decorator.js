"use strict";
function JsonApiDatastoreConfig(config) {
    if (config === void 0) { config = {}; }
    return function (target) {
        Reflect.defineMetadata('JsonApiDatastoreConfig', config, target);
    };
}
exports.JsonApiDatastoreConfig = JsonApiDatastoreConfig;
//# sourceMappingURL=json-api-datastore-config.decorator.js.map