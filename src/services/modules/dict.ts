
import { http } from "@/services/core/http";
import type { IDictData, IDictDataQuery, IDictType, IDictTypeQuery } from "../types/dict";
import type { IQueryPage } from "../types/types";

class DictService {
    private static instance: DictService;
    static getInstance() {
        if (!DictService.instance) {
            DictService.instance = new DictService();
        }
        return DictService.instance;
    }


    /**
     * 获取字典列表
     * @param {IDictTypeQuery & IQueryPage} query
     * @param {string} query.name 字典名称
     * @param {string} query.code 字典编码
     * @param {string} query.systemFlag 系统标识
     * @param {number} query.status 状态
     * @param {number} query.current 当前页码
     * @param {number} query.size 每页数量
     * @returns {Promise<any[]>} 字典列表
     */
    getDictList(query: IDictTypeQuery & IQueryPage) {
        return http.get<any[]>("/dict/list", {
            params: {
                ...query,
            }
        });
    }

    /**
     * 添加字典类型
     * @param {IDictType} data
     * @param {IDictType} data
     * @param {string} data.name 字典名称
     * @param {string} data.code 字典编码
     * @param {string} data.systemFlag 系统标识
     * @param {number} data.status 状态
     * @param {string} data.description 字典描述
     * @returns
     */
    addDictType(data: IDictType) {
        return http.post("/dict/add", data);
    }

    /**
     * 更新字典类型
     * @param {IDictType} data
     * @param {string} data.id 字典类型ID
     * @param {string} data.name 字典名称
     * @param {string} data.code 字典编码
     * @param {string} data.systemFlag 系统标识
     * @param {number} data.status 状态
     * @param {string} data.description 字典描述
     * @returns {Promise<ApiResponse>} 更新结果
     */
    updateDictType(data: IDictType) {
        return http.put("/dict/update", data);
    }


    /**
     * 删除字典类型
     * @param {string} id 字典类型ID
     * @returns {Promise<ApiResponse>} 删除结果
     */
    removeDictType(id: string) {
        return http.delete(`/dict/remove/${id}`);
    }


    /**
     * 获取字典类型详情
     * @param {string} id 字典类型ID
     * @returns {Promise<IDictType>} 字典类型详情
     */
    getDictTypeDetail(id: string) {
        return http.get<IDictType>(`/dict/detail/${id}`);
    }


    /**
     * 获取字典数据列表
     * @param {string} id 字典类型ID
     * @returns {Promise<IDictData[]>} 字典数据列表
     */
    getDictDataList(query: IDictDataQuery & IQueryPage) {
        return http.get<IDictData[]>(`/dict/data/list`, {
            params: {
                ...query
            }
        });
    }


    /**
     * 添加字典数据
     * @param {IDictData} data
     * @param {string}  data.dictValue 字典值
     * @param {string}  data.dictLabel 字典标签
     * @param {string}  data.dictRemark 字典备注
     * @param {number}  data.dictSort 字典排序
     * @param {number}  data.dictTypeId 字典类型ID
     * @returns {Promise<ApiResponse>} 添加结果
     */
    addDictData(data: IDictData) {
        return http.post("/dict/data/add", data);
    }


    /**
     * 更新字典数据
     * @param {IDictData} data
     * @param {string}  data.id 字典数据ID
     * @param {string}  data.dictValue 字典值
     * @param {string}  data.dictLabel 字典标签
     * @param {string}  data.dictRemark 字典备注
     * @param {number}  data.dictSort 字典排序
     * @param {number}  data.dictTypeId 字典类型ID
     * @returns {Promise<ApiResponse>} 更新结果
     */
    updateDictData(data: IDictData) {
        return http.put("/dict/data/update", data);
    }


    /**
     * 删除字典数据
     * @param {string} id 字典数据ID
     * @returns {Promise<ApiResponse>} 删除结果
     */
    removeDictData(id: string) {
        return http.delete(`/dict/data/remove/${id}`);
    }


    /**
     * 获取字典数据详情
     * @param {string} id 字典数据ID
     * @returns {Promise<IDictData>} 字典数据详情
     */
    getDictDataDetail(id: string) {
        return http.get<IDictData>(`/dict/data/detail/${id}`);
    }   


}


export const dictService = DictService.getInstance();

