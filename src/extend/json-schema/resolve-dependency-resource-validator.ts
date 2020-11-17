import {provide, init, scope} from 'midway';

// @ts-ignore
import {IJsonSchemaValidate, CommonJsonSchema} from 'egg-freelog-base'
import {ValidatorResult} from "jsonschema";

@scope('Singleton')
@provide('resolveDependencyOrUpcastValidator')
export class ResolveDependencyResourceValidator extends CommonJsonSchema implements IJsonSchemaValidate {

    /**
     * 解决依赖资源格式校验
     * @param {object[]} operations 解决依赖资源数据
     * @returns {ValidatorResult}
     */
    validate(operations: object[]): ValidatorResult {
        return super.validate(operations, this.schemas['/resolveResourceSchema']);
    }

    /**
     * 注册所有的校验
     * @private
     */
    @init()
    registerValidators() {

        super.addSchema({
            id: '/resolveResourceSchema',
            type: 'array',
            uniqueItems: true,
            items: {
                type: 'object',
                required: true,
                additionalProperties: false,
                properties: {
                    resourceId: {type: 'string', required: true, format: 'mongoObjectId'},
                    contracts: {
                        type: 'array',
                        uniqueItems: true,
                        required: true,
                        maxItems: 10,
                        minItems: 1,
                        items: {
                            type: 'object',
                            required: true,
                            additionalProperties: false,
                            properties: {
                                policyId: {type: 'string', required: true, format: 'md5'}
                            }
                        }
                    }
                }
            }
        });

        super.addSchema({
            id: '/upcastResourceSchema',
            type: 'array',
            uniqueItems: true,
            items: {
                type: 'object',
                required: true,
                additionalProperties: false,
                properties: {
                    resourceId: {type: 'string', required: true, format: 'mongoObjectId'}
                }
            }
        });
    }
}
