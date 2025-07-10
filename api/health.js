import { http } from '@/utils/request'

// 获取最新健康记录
export function getLatestHealthAPI() {
    return http({
        url: '/healthIndex/latest',
        method: 'GET'
    })
}

// 获取健康记录列表
export function getHealthListAPI() {
    return http({
        url: '/healthIndex/list',
        method: 'GET'
    })
}

// 添加健康记录
export function addHealthRecordAPI(data) {
    return http({
        url: '/healthIndex/add',
        method: 'POST',
        data
    })
}

// 获取健康评估
export function getHealthEvaluationAPI() {
    return http({
        url: '/healthIndex/evaluation',
        method: 'GET'
    })
}

// 获取健康趋势数据
export function getHealthTrendAPI(params) {
    return http({
        url: '/healthIndex/trend',
        method: 'GET',
        params
    })
} 