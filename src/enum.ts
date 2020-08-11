/**
 * 标的物类型
 */
export enum SubjectTypeEnum {
    Resource = 1,
    Presentable = 2,
    UserGroup = 3
}

/**
 * 合同类型
 */
export enum IdentityType {
    Resource = 1,
    Node,
    ClientUser
}

export enum ContractStatusEnum {
    /**
     * 正常生效中
     */
    Executed = 0,

    /**
     * 合同已终止(未授权,并且不再接受新事件)
     * @type {number}
     */
    Terminated = 1,

    /**
     * 异常的,例如签名不对,冻结等.
     * @type {number}
     */
    Exception = 2
}