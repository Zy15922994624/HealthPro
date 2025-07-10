import { http } from '@/utils/request.js'

// 获取饮食记录列表
export const getDietListAPI = () => {
    return http({
        url: '/dietRecord/list',
        method: 'GET'
    })
}

// 添加饮食记录
export const addDietRecordAPI = (data) => {
    // 直接传递数据，因为字段名已经匹配
    return http({
        url: '/dietRecord/add',
        method: 'POST',
        data: data  // 前后端字段名完全一致，无需转换
    })
}

// 删除饮食记录
export const deleteDietRecordAPI = (id) => {
    return http({
        url: `/dietRecord/${id}`,
        method: 'DELETE'
    })
}

// 获取食物基础数据列表
export const getDietTypesAPI = () => {
    return http({
        url: '/dietRecord/food/list',
        method: 'GET'
    })
}

// 获取今日饮食统计
export const getDietStatsAPI = () => {
    return http({
        url: '/dietRecord/today/stats',
        method: 'GET'
    })
}

// 获取饮食趋势数据
export const getDietTrendAPI = (params) => {
    return http({
        url: '/dietRecord/trend',
        method: 'GET',
        params
    })
}
