export interface IDictType {
    id?: string | number;
    dictName: string;
    dictCode: string;
    dictDesc?: string;
    systemFlag: string;
    status?: number;
    createTime?: string;
    updateTime?: string;

    [key: string]: any;
}

export interface IDictTypeQuery {
    dictName?: string;
    dictCode?: string;
    systemFlag?: string;
    status?: string;

    [key: string]: any;
}

export interface IDictData {
    id?: string | number;
    dictValue: string;
    dictLabel: string;
    dictRemark?: string;
    dictSort?: number | undefined;
    dictTypeId: number | undefined;
    dictType?: string;
    dictDesc?: string;
    status?: number;
    createTime?: string;
    updateTime?: string;

    [key: string]: any;
}

export interface IDictDataQuery {
    dictValue?: string;
    dictLabel?: string;
    status?: number;

    [key: string]: any;
}
