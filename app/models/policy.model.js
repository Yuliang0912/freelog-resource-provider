/**
 * Created by yuliang on 2017/8/11.
 */

'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResourcePolicySchema = new Schema({
    resourceId: {type: String, required: true},
    serialNumber: {type: String, required: true}, //序列号,用于校验前端与后端是否一致
    policy: {type: Array, default: []}, //引用策略段
    policyText: {type: String, default: ''}, //引用策略描述语言原文
    languageType: {type: String, required: true},
    userId: {type: Number, required: true},
    status: {type: Number, default: 0, required: true},
}, {
    versionKey: false,
    timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'}
})

ResourcePolicySchema.index({resourceId: 1, userId: 1});

module.exports = mongoose.model('policy', ResourcePolicySchema)