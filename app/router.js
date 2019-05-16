'use strict';

/**
 * restful wiki: http://eggjs.org/zh-cn/basics/router.html
 */

module.exports = app => {

    const {router, controller} = app
    const {temporaryFile, resource, collection, release, mockResource, releaseScheme, mockResourceBucket} = controller

    router.put('release-batch-sign', '/v1/releases/:releaseId/batchSignContracts', release.v1.batchSignReleaseContracts)

    //post-method-api
    router.post('upload-file', '/v1/resources/temporaryFiles/uploadResourceFile', temporaryFile.v1.uploadResourceFile)
    router.post('upload-preview-image', '/v1/resources/temporaryFiles/uploadPreviewImage', temporaryFile.v1.uploadPreviewImage)

    //get-method-api
    router.get('resource-list', '/v1/resources/list', resource.v1.list)
    router.get('resource-releases', '/v1/resources/:resourceId/releases', resource.v1.releases)
    router.get('resource-file-info', '/v1/resources/resourceFileInfo', resource.v1.resourceFileInfo)
    router.get('bucket-is-exist', '/v1/resources/mocks/buckets/isExist', mockResourceBucket.v1.isExistBucketName)
    router.get('mock-name-is-exist', '/v1/resources/mocks/isExistMockName', mockResource.v1.isExistMockName)
    router.get('release-list', '/v1/releases/list', release.v1.list)
    router.get('release-scheme-list', '/v1/releases/versions/list', releaseScheme.v1.list)
    router.get('release-detail-info', '/v1/releases/detail/:username/:releaseName', release.v1.detail)
    router.get('release-auth-tree', '/v1/releases/:releaseId/authTree', release.v1.releaseAuthTree)
    router.get('release-upcast-tree', '/v1/releases/:releaseId/upcastTree', release.v1.releaseUpcastTree)
    router.get('release-dependency-tree', '/v1/releases/:releaseId/dependencyTree', release.v1.dependencyTree)
    router.get('release-detail', '/v1/releases/detail', release.v1.detail)
    router.get('resource-download', '/v1/resources/:resourceId/download', resource.v1.download)
    router.get('release-is-collection', '/v1/collections/releases/isCollection', collection.v1.isCollection)


    //restful-api
    router.resources('release-info', '/v1/releases', release.v1)
    router.resources('release-scheme-info', '/v1/releases/:releaseId/versions', releaseScheme.v1)
    router.resources('mock-resource-bucket', '/v1/resources/mocks/buckets', mockResourceBucket.v1)
    router.resources('mock-resource', '/v1/resources/mocks', mockResource.v1)
    router.resources('collection-info', '/v1/collections/releases', collection.v1)
    router.resources('resource-info', '/v1/resources', resource.v1)
}
