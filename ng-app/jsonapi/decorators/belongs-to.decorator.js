"use strict";
function BelongsTo(config) {
    if (config === void 0) { config = {}; }
    return function (target, propertyName) {
        var annotations = Reflect.getMetadata('BelongsTo', target) || [];
        annotations.push({
            propertyName: propertyName,
            relationship: config.key || propertyName
        });
        Reflect.defineMetadata('BelongsTo', annotations, target);
    };
}
exports.BelongsTo = BelongsTo;
//# sourceMappingURL=belongs-to.decorator.js.map