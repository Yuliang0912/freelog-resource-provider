export default () => {
    const config: any = {};

    config.cluster = {
        listen: {
            port: 5101
        }
    };

    config.mongoose = {
        url: `mongodb://resource_service:QzA4Qzg3QTA3NDRCQTA0NDU1RUQxMjI3MTA4ODQ1MTk=@dds-wz9ac40fee5c09441.mongodb.rds.aliyuncs.com:3717,dds-wz9ac40fee5c09442.mongodb.rds.aliyuncs.com:3717/test-resources?replicaSet=mgset-44484047`,
    };

    config.elasticSearch = {
        url: 'http://172.18.215.229:9200'
    };

    config.uploadConfig = {
        aliOss: {
            internal: true,
        },
        amzS3: {}
    };

    return config;
};
