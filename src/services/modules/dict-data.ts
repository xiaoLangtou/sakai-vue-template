
import { http } from "@/services/core/http";
import type { IDictData, IDictDataQuery } from "../types/dict";
import type { IQueryPage } from "../types/types";

class DictDataService {
    private static instance: DictDataService;
    static getInstance() {
        if (!DictDataService.instance) {
            DictDataService.instance = new DictDataService();
        }
        return DictDataService.instance;
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


export const dictDataService = DictDataService.getInstance();

