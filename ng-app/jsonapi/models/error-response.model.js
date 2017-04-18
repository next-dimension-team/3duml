"use strict";
var ErrorResponse = (function () {
    function ErrorResponse(errors) {
        this.errors = [];
        if (errors) {
            this.errors = errors;
        }
    }
    return ErrorResponse;
}());
exports.ErrorResponse = ErrorResponse;
//# sourceMappingURL=error-response.model.js.map