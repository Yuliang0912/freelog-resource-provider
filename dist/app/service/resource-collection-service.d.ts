import { CollectionResourceInfo, ICollectionService } from '../../interface';
export declare class ResourceCollectionService implements ICollectionService {
    ctx: any;
    resourceCollectionProvider: any;
    collectionResource(model: CollectionResourceInfo): Promise<CollectionResourceInfo>;
    isCollected(resourceIds: string[]): Promise<Array<{
        resourceId: string;
        isCollected: boolean;
    }>>;
    find(condition: object, ...args: any[]): Promise<CollectionResourceInfo[]>;
    findOne(condition: object, ...args: any[]): Promise<CollectionResourceInfo>;
    deleteOne(condition: object): Promise<boolean>;
    findPageList(resourceType: string, keywords: string, resourceStatus: number, page: number, pageSize: number): Promise<{
        page: number;
        pageSize: number;
        totalItem: any;
        dataList: any[];
    }>;
}
