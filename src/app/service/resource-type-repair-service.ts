import {inject, provide} from 'midway';
import {IMongodbOperation} from 'egg-freelog-base';
import {CollectionResourceInfo, ResourceInfo, ResourceVersionInfo} from '../../interface';
import {OutsideApiService} from './outside-api-service';
import {uniq} from 'lodash';

@provide()
export class ResourceTypeRepairService {
    @inject()
    resourceProvider: IMongodbOperation<ResourceInfo>;
    @inject()
    resourceVersionProvider: IMongodbOperation<ResourceVersionInfo>;
    @inject()
    resourceCollectionProvider: IMongodbOperation<CollectionResourceInfo>;
    @inject()
    outsideApiService: OutsideApiService;

    resourceTypeMap = new Map<string, string[]>([
        ['theme', ['主题']],
        ['widget', ['插件']],
        ['reveal_slide', ['演示文稿']],
        ['novel', ['阅读', '文章']],
        ['txt', ['阅读', '文章']],
        ['markdown', ['阅读', '文章']],
        ['image', ['图片']],
        ['comic', ['图片']],
        ['video', ['视频']],
        ['audio', ['音频']],
    ]);

    /**
     * 资源类型数据修复,单字符串改成数组
     */
    async resourceTypeRepair() {
        return this.resourceProvider.find({}, 'resourceType').then(async list => {
            for (let resourceInfo of list) {
                let resourceType = resourceInfo.resourceType;
                const resourceId = resourceInfo.resourceId;
                for (let [key, value] of this.resourceTypeMap) {
                    if (resourceType.includes(key)) {
                        resourceType.splice(resourceType.indexOf(key), 1, ...value);
                    }
                }
                resourceType = uniq(resourceType);
                this.resourceProvider.updateOne({_id: resourceId}, {resourceType}).then();
                this.resourceVersionProvider.updateMany({resourceId}, {resourceType}).then();
                this.resourceCollectionProvider.updateMany({resourceId}, {resourceType}).then();
            }
        });
    }

    /**
     * 资源过期合约清理
     */
    async resourceExpiredContractClear() {
        const resourceVersionInfos = await this.resourceVersionProvider.find({}, 'versionId resolveResources');
        for (let resourceVersion of resourceVersionInfos) {
            const contractIds = resourceVersion.resolveResources.map(x => x.contracts).flat().map(x => x.contractId);
            const expiredContractSet = await this.outsideApiService.getContractByContractIds(contractIds, {
                projection: 'contractId,status'
            }).then(list => {
                return new Set(list.filter(x => x.status === 1).map(x => x.contractId));
            });
            if (!expiredContractSet.size) {
                continue;
            }
            console.log(resourceVersion.versionId, [...expiredContractSet.values()]);
            for (let resolveResource of resourceVersion.resolveResources) {
                resolveResource.contracts = resolveResource.contracts.filter(x => !expiredContractSet.has(x.contractId));
            }
            this.resourceVersionProvider.updateOne({versionId: resourceVersion.versionId}, {
                resolveResources: resourceVersion.resolveResources
            }).catch(console.error);
        }
    }

    /**
     * 资源meta修复
     */
    async resourceMetaRepair() {
        this.resourceVersionProvider.find({}).then(list => {
            for (let resourceVersionInfo of list) {
                this.outsideApiService.getFileStorageInfo(resourceVersionInfo.fileSha1).then(fileStorageInfo => {
                    if (fileStorageInfo?.metaInfo) {
                        this.resourceVersionProvider.updateOne({versionId: resourceVersionInfo.versionId}, {
                            systemProperty: fileStorageInfo.metaInfo
                        });
                    }
                });
            }
        });
    }
}
