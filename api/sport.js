import { http } from '@/utils/request.js'

// 获取运动记录列表
export const getSportListAPI = () => {
    return http({
        url: '/sportRecord/list',
        method: 'GET'
    })
}

// 添加运动记录
export const addSportRecordAPI = (data) => {
    return http({
        url: '/sportRecord/add',
        method: 'POST',
        data: data
    })
}

// 删除运动记录
export const deleteSportRecordAPI = (id) => {
    return http({
        url: `/sportRecord/${id}`,
        method: 'DELETE'
    })
}

// 获取运动类型列表
export const getSportTypesAPI = () => {
    return http({
        url: '/sportRecord/types',
        method: 'GET'
    })
} 

// 获取运动趋势数据
export const getSportTrendAPI = (params) => {
    return http({
        url: '/sportRecord/trend',
        method: 'GET',
        params
    })
}
