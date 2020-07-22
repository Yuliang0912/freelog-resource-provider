import { CreateResourceVersionOptions, IResourceVersionService, ResourceInfo, ResourceVersionInfo, UpdateResourceVersionOptions } from '../../interface';
export declare class ResourceVersionService implements IResourceVersionService {
    ctx: any;
    resourceService: any;
    resourceVersionProvider: any;
    resourcePropertyGenerator: any;
    resourceVersionDraftProvider: any;
    find(condition: object, ...args: any[]): Promise<ResourceVersionInfo[]>;
    findOne(condition: object, ...args: any[]): Promise<ResourceVersionInfo>;
    /**
     * 为资源创建版本
     * @param {ResourceInfo} resourceInfo 资源信息
     * @param {CreateResourceVersionOptions} options 更新选项
     * @returns {Promise<ResourceVersionInfo>}
     */
    createResourceVersion(resourceInfo: ResourceInfo, options: CreateResourceVersionOptions): Promise<ResourceVersionInfo>;
    /**
     * 更新资源版本
     * @param {ResourceVersionInfo} versionInfo
     * @returns {Promise<void>}
     */
    updateResourceVersion(versionInfo: ResourceVersionInfo, options: UpdateResourceVersionOptions): Promise<ResourceVersionInfo>;
    /**
     * 资源批量签约
     * @param {ResourceVersionInfo} versionInfo
     * @param {any[]} changedResolveResources
     * @returns {Promise<any>}
     */
    resourceBatchSignContract(versionInfo: ResourceVersionInfo, changedResolveResources?: any[]): Promise<any>;
    /**
     * 保存资源草稿
     * @param {ResourceInfo} resourceInfo
     * @param {CreateResourceVersionOptions} options
     * @returns {Promise<any>}
     */
    saveOrUpdateResourceVersionDraft(resourceInfo: ResourceInfo, options: CreateResourceVersionOptions): Promise<any>;
    /**
     * 获取资源版本草稿
     * @param {string} resourceId
     * @returns {Promise<any>}
     */
    getResourceVersionDraft(resourceId: string): Promise<any>;
    /**
     * 检查依赖项是否符合标准
     * 1:依赖的资源不能重复,并且是上架状态
     * 2.依赖的资源与主资源之间不能存在循环引用.
     * 3.资源的依赖树深度不能超过固定阈值(20)
     * @param ctx
     * @param dependencies
     * @returns {Promise<any>}
     * @private
     */
    _validateDependencies(resourceId: any, dependencies: any): Promise<object[]>;
    /**
     * 循坏依赖检查
     * @param resourceId
     * @param dependencies
     * @param {number} deep
     * @returns {Promise<{ret: boolean; deep?: number}>}
     * @private
     */
    _cycleDependCheck(resourceId: any, dependencies: any, deep?: number): Promise<{
        ret: boolean;
        deep?: number;
    }>;
    /**
     * 验证上抛和需要解决的资源
     * @param dependencies
     * @param resolveResources
     * @param baseUpcastReleases
     * @param {boolean} isCheckBaseUpcast
     * @returns {Promise<{resolveResources: any; upcastResources: object[]}>}
     * @private
     */
    _validateUpcastAndResolveResource(dependencies: any, resolveResources: any, baseUpcastResources: any, isCheckBaseUpcast?: boolean): Promise<{
        resolveResources: any;
        upcastResources: object[];
    }>;
    /**
     * 通过依赖和基础上抛,推断出当前版本实际需要解决的资源,实际上抛的资源.
     * allUntreatedResources: 当前版本的依赖资源以及依赖的上抛资源集合
     * backlogResources: 所有需要待处理的资源(必须要当前版本解决的)
     * upcastResources: 当前版本真实的上抛资源(基础上抛的子集)
     * @param dependencies
     * @param baseUpcastResources
     * @returns {Promise<{upcastResources: object[]; backlogResources: object[]; allUntreatedResources: object[]}>}
     * @private
     */
    _getRealUpcastAndResolveResources(dependencies: any, baseUpcastResources: any): Promise<{
        upcastResources: object[];
        backlogResources: object[];
        allUntreatedResources: object[];
    }>;
}
