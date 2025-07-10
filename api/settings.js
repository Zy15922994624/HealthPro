import { http } from '@/utils/request'

// 获取用户设置
export function getUserSettingsAPI() {
    return http({
        url: '/settings',
        method: 'GET'
    })
}

// 更新用户设置
export function updateSettingsAPI(data) {
    return http({
        url: '/settings/update',
        method: 'POST',
        data
    })
} 