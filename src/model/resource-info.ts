import {omit, assign} from 'lodash';
import {scope, provide} from 'midway';
import {MongooseModelBase, IMongooseModelBase} from './mongoose-model-base';

@scope('Singleton')
@provide('model.ResourceInfo') // 此model可能考虑不要
export class ResourceInfoModel extends MongooseModelBase implements IMongooseModelBase {

    buildMongooseModel() {

        const ResourceVersionSchema = new this.mongoose.Schema({
            version: {type: String, required: true},
            versionId: {type: String, unique: true, required: true},
            createDate: {type: Date, required: true}
        }, {_id: false});

        const UpcastResourceSchema = new this.mongoose.Schema({
            resourceId: {type: String, required: true},
            resourceName: {type: String, required: true},
        }, {_id: false});

        const PolicySchema = new this.mongoose.Schema({
            policyId: {type: String, required: true},
            policyName: {type: String, required: true},
            policyText: {type: String, required: true},
            status: {type: Number, required: true}, // 0:不启用  1:启用
            authorizedObjects: [] // 授权对象
        }, {_id: false});

        const resourceInfoScheme = new this.mongoose.Schema({
            resourceName: {type: String, required: true},
            resourceType: {type: String, required: true},
            latestVersion: {type: String, default: '', required: false}, // 实际取值最大的版本,并非最新加入的
            resourceVersions: {type: [ResourceVersionSchema], default: [], required: false},
            userId: {type: Number, required: true},
            username: {type: String, required: true},
            baseUpcastResources: {type: [UpcastResourceSchema], default: [], required: false},
            intro: {type: String, required: false, default: ''},
            coverImages: {type: [String], default: [], required: false},
            tags: {type: [String], required: false, default: []},
            policies: {type: [PolicySchema], default: [], required: false},
            uniqueKey: {type: String, unique: true, required: true}, // 资源名称排他性值,通过resourceName全部转成成小写.然后sha1计算
            status: {type: Number, default: 0, required: true}, // 0:下架 1:上架
        }, {
            versionKey: false,
            timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'},
            toJSON: ResourceInfoModel.toObjectOptions,
            toObject: ResourceInfoModel.toObjectOptions
        });

        resourceInfoScheme.index({resourceName: 1}, {unique: true});
        resourceInfoScheme.index({userId: 1, username: 1, resourceType: 1});
        resourceInfoScheme.virtual('resourceId').get(function (this: any) {
            return this.id;
        });
        // resourceInfoScheme.virtual('latestVersion').get(function (this: any) {
        //     const versionCount = Array.isArray(this.resourceVersions) ? this.resourceVersions.length : 0;
        //     return versionCount ? this.resourceVersions[versionCount - 1] : null;
        // });

        return this.mongoose.model('resource-infos', resourceInfoScheme);
    }

    static get toObjectOptions() {
        return {
            getters: true,
            virtuals: true,
            transform(doc, ret) {
                return assign({resourceId: doc.id}, omit(ret, ['_id', 'id', 'uniqueKey']));
            }
        };
    }
}