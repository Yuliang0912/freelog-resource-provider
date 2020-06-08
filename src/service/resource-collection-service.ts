import {provide, inject} from 'midway';
import {isString, flatten} from 'lodash';
import {CollectionResourceInfo, ICollectionService} from "../interface";

@provide('resourceCollectionService')
export class ResourceCollectionService implements ICollectionService {

    @inject()
    ctx;
    @inject()
    resourceCollectionProvider;

    async collectionResource(model: CollectionResourceInfo): Promise<CollectionResourceInfo> {
        return this.resourceCollectionProvider.findOneAndUpdate({
            resourceId: model.resourceId, userId: model.userId
        }, model, {new: true}).then(collectionInfo => {
            return collectionInfo || this.resourceCollectionProvider.create(model);
        });
    }

    async isCollected(resourceIds: String[]): Promise<{ resourceId: string, isCollected: boolean }[]> {
        const condition = {
            userId: this.ctx.request.userId, resourceId: {$in: resourceIds}
        };
        const collectedResourceSet = await this.resourceCollectionProvider.find(condition, 'resourceId')
            .then(list => new Set(list.map(x => x.resourceId)));
        return resourceIds.map(resourceId => Object({resourceId, isCollected: collectedResourceSet.has(resourceId)}));
    }

    async find(condition: object, ...args): Promise<CollectionResourceInfo[]> {
        return this.resourceCollectionProvider.find(condition, ...args);
    }

    async findOne(condition: object, ...args): Promise<CollectionResourceInfo> {
        return this.resourceCollectionProvider.findOne(condition, ...args);
    }

    async deleteOne(condition: object): Promise<boolean> {
        return this.resourceCollectionProvider.deleteOne(condition).then(ret => ret.ok > 0);
    }

    async findPageList(resourceType: string, keywords: string, resourceStatus: number, page: number, pageSize: number) {
        let condition: any = {userId: this.ctx.request.userId};
        if (resourceType) {
            condition.resourceType = resourceType
        }
        if (isString(keywords) && keywords.length > 0) {
            let searchRegExp = new RegExp(keywords, "i")
            if (/^[0-9a-fA-F]{4,24}$/.test(keywords)) {
                condition.$or = [{resourceName: searchRegExp}, {resourceId: keywords.toLowerCase()}]
            } else {
                condition.resourceName = searchRegExp
            }
        }

        let resourceMatchAggregates: any[] = [{
            $match: {
                "resourceInfos.status": resourceStatus
            }
        }];
        let collectionMatchAggregates: any[] = [{
            $match: condition
        }];
        let joinResourceAggregates: any[] = [
            {
                $addFields: {"resource_id": {"$toObjectId": "$resourceId"}}
            }, {
                $lookup: {
                    from: "resource-infos",
                    localField: "resource_id",
                    foreignField: "_id",
                    as: "resourceInfos"
                }
            }];
        let countAggregates: any[] = [{$count: "totalItem"}];
        let pageAggregates: any[] = [{
            $skip: (page - 1) * pageSize
        }, {
            $limit: pageSize
        }];

        let countAggregatePipelines: any[] = [], resultAggregatePipelines: any[] = [];
        if ([0, 1].includes(resourceStatus)) {
            countAggregatePipelines = flatten([
                collectionMatchAggregates, joinResourceAggregates, resourceMatchAggregates, countAggregates
            ]);
            resultAggregatePipelines = flatten([
                collectionMatchAggregates, joinResourceAggregates, resourceMatchAggregates, pageAggregates
            ])
        } else {
            countAggregatePipelines = flatten([
                collectionMatchAggregates, joinResourceAggregates, countAggregates
            ])
            resultAggregatePipelines = flatten([
                collectionMatchAggregates, pageAggregates, joinResourceAggregates
            ])
        }

        const [totalItemInfo] = await this.resourceCollectionProvider.aggregate(countAggregatePipelines);
        let {totalItem = 0} = totalItemInfo || {};
        const result = {page, pageSize, totalItem, dataList: []}
        if (totalItem <= (page - 1) * pageSize) {
            return result
        }

        result.dataList = await this.resourceCollectionProvider.aggregate(resultAggregatePipelines).map(model => {
            let {resourceId, createDate, resourceInfos = []} = model
            let resourceInfo: any = resourceInfos.length ? resourceInfos[0] : {};
            let {resourceName, resourceType, policies, userId, username, coverImages, resourceVersions, updateDate, status} = resourceInfo;
            return {
                resourceId, resourceName, resourceType, policies, coverImages, resourceVersions,
                authorId: userId,
                authorName: username,
                collectionDate: createDate,
                resourceStatus: status,
                resourceUpdateDate: updateDate,
            }
        })
        return result;
    }
}
