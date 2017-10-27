/**
 * Created by yuliang on 2017/8/11.
 * 资源对外引用策略相关restful API
 */

'use strict'

module.exports = app => {
    return class PolicyController extends app.Controller {

        /**
         * 获取policyList
         * @param ctx
         * @returns {Promise.<void>}
         */
        async index(ctx) {
            let resourceIds = ctx.checkQuery('resourceIds').exist().isSplitResourceId().value

            ctx.validate()

            let condition = {
                resourceId: {$in: resourceIds.split(',')}
            }

            await ctx.service.resourcePolicyService.getPolicyList(condition).bind(ctx).then(ctx.success)
        }

        /**
         * 展示资源的引用策略
         * @param ctx
         * @returns {Promise.<void>}
         */
        async show(ctx) {
            let resourceId = ctx.checkParams('id').notEmpty().isResourceId().value

            await ctx.validate().service.resourcePolicyService.getResourcePolicy({
                resourceId, status: 0
            }).bind(ctx).then(ctx.success).catch(ctx.error)
        }

        /**
         * 创建资源的引用策略
         * @param ctx
         * @returns {Promise.<void>}
         */
        async create(ctx) {
            let resourceId = ctx.checkBody('resourceId').isResourceId().value
            let policyText = ctx.checkBody('policyText').notEmpty().isBase64().decodeBase64().value //base64编码之后的字符串
            let languageType = ctx.checkBody('languageType').default('freelog_policy_lang').in(['freelog_policy_lang']).value

            ctx.allowContentType({type: 'json'}).validate()

            let policy = {
                userId: ctx.request.userId,
                resourceId, policyText, languageType
            }

            await ctx.service.resourceService.getResourceInfo({
                resourceId,
                userId: policy.userId
            }).then(resourceInfo => {
                !resourceInfo && ctx.error({msg: 'resourceId错误或者没有权限'})
            })

            await ctx.service.resourcePolicyService.createOrUpdateResourcePolicy(policy).bind(ctx).then(policy => {
                return ctx.service.resourceService.updateResource({status: 2}, {resourceId}).then(() => policy)
            }).then(ctx.success).catch(ctx.error)
        }

        /**
         * 更新资源的引用策略
         * @returns {Promise.<void>}
         */
        async update(ctx) {
            let resourceId = ctx.checkParams('id').notEmpty().isResourceId().value
            let policyText = ctx.checkBody('policyText').notEmpty().isBase64().decodeBase64().value //base64编码之后授权语言字符串
            let languageType = ctx.checkBody('languageType').default('freelog_policy_lang').in(['yaml', 'freelog_policy_lang']).value

            ctx.allowContentType({type: 'json'}).validate()

            let policy = await ctx.validate().service.resourcePolicyService.getResourcePolicy({
                resourceId,
                userId: ctx.request.userId
            })

            if (!policy || policy.status !== 0) {
                ctx.error({msg: "未找到需要更新的策略或者策略与用户不匹配"})
            }

            policy.policyText = policyText
            policy.languageType = languageType

            await ctx.service.resourcePolicyService.createOrUpdateResourcePolicy(policy).bind(ctx)
                .then(data => ctx.success(!!data)).catch(ctx.error)
        }

        /**
         * 删除资源引用策略
         * @param ctx
         * @returns {Promise.<void>}
         */
        async destroy(ctx) {

            let resourceId = ctx.checkParams('id').notEmpty().isResourceId().value

            let policy = await ctx.validate().service.resourcePolicyService.getResourcePolicy({
                resourceId,
                userId: ctx.request.userId
            })

            if (!policy) {
                ctx.error({msg: "策略不存在或者策略与用户不匹配"})
            }

            //此处保持请求幂等性,返回无异常即为删除成功,故直接返回true
            await ctx.service.resourcePolicyService.deleteResourcePolicy({resourceId}).bind(ctx)
                .then(data => ctx.success(true)).catch(ctx.error)
        }
    }
}