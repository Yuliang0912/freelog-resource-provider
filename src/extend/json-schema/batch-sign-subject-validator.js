"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BatchSignSubjectValidator = void 0;
var midway_1 = require("midway");
var egg_freelog_base_1 = require("egg-freelog-base");
var BatchSignSubjectValidator = /** @class */ (function (_super) {
    __extends(BatchSignSubjectValidator, _super);
    function BatchSignSubjectValidator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 解决依赖资源格式校验
     * @param {object[]} operations 解决依赖资源数据
     * @returns {ValidatorResult}
     */
    BatchSignSubjectValidator.prototype.validate = function (operations) {
        return _super.prototype.validate.call(this, operations, this.schemas['/signSubjectSchema']);
    };
    /**
     * 注册所有的校验
     * @private
     */
    BatchSignSubjectValidator.prototype.registerValidators = function () {
        _super.prototype.addSchema.call(this, {
            id: '/signSubjectSchema',
            type: 'array',
            uniqueItems: true,
            items: {
                type: 'object',
                required: true,
                additionalProperties: false,
                minItems: 1,
                maxItems: 100,
                properties: {
                    subjectId: { type: 'string', required: true, format: 'mongoObjectId' },
                    versions: {
                        type: 'array',
                        required: true,
                        additionalProperties: false,
                        properties: {
                            policyId: { type: 'string', required: true, format: 'md5' },
                            version: { type: 'string', required: true, minLength: 1, maxLength: 100 },
                            operation: { type: 'integer', "enum": [0, 1] }, // 0:搁置 1:应用
                        }
                    }
                }
            }
        });
    };
    __decorate([
        (0, midway_1.init)()
    ], BatchSignSubjectValidator.prototype, "registerValidators");
    BatchSignSubjectValidator = __decorate([
        (0, midway_1.scope)('Singleton'),
        (0, midway_1.provide)('batchSignSubjectValidator')
    ], BatchSignSubjectValidator);
    return BatchSignSubjectValidator;
}(egg_freelog_base_1.CommonJsonSchema));
exports.BatchSignSubjectValidator = BatchSignSubjectValidator;
