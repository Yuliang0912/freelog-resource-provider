import {provide, inject, scope} from 'midway';
import * as MongoBaseOperation from 'egg-freelog-database/lib/database/mongo-base-operation';

@provide()
@scope('Singleton')
export default class ResourceCollectionProvider extends MongoBaseOperation {
    constructor(@inject('model.ResourceCollection') model) {
        super(model);
    }
}