import { http } from '@/utils/request.js'
import store from '@/store'

// 登录接口
export const loginAPI = ({ username, password }) => {
    const data = `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    return http({
        url: '/user/login',
        method: 'POST',
        data: data,
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

// 获取用户信息接口
export const getUserInfoAPI = () => {
    return http({
        url: '/user/info',
        method: 'GET'
    })
}

// 注册接口
export const registerAPI = ({ username, password }) => {
    const data = `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    return http({
        url: '/user/register',
        method: 'POST',
        data: data,
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

// 信息修改接口
export const updateUserInfoAPI = (data) => {
    return http({
        url: '/user/update',
        method: 'PUT',
        data: data
    })
}

// 密码修改接口
export const updatePasswordAPI = ({ oldPassword, newPassword, rePassword }) => {
    return http({
        url: '/user/password',
        method: 'PUT',
        data: {
            oldPassword,
            newPassword,
            rePassword
        }
    })
}

// 头像上传接口
export const uploadAvatarAPI = (filePath) => {
    return new Promise((resolve, reject) => {
        uni.uploadFile({
            url: 'http://localhost:8080/file/upload',
            filePath: filePath,
            name: 'imgfile',
            header: {
                'Authorization': store.getters['user/getToken']
            },
            success: (uploadRes) => {
                try {
                    if (uploadRes.statusCode !== 200) {
                        reject(new Error('上传失败，状态码：' + uploadRes.statusCode))
                        return
                    }
                    const data = JSON.parse(uploadRes.data)
                    if (data.code === 0) {
                        resolve(data.data || 'default.jpg')
                    } else {
                        reject(new Error(data.msg || '上传失败'))
                    }
                } catch (error) {
                    reject(new Error('解析返回数据失败'))
                }
            },
            fail: (err) => reject(err)
        })
    })
}

// 头像地址更新接口
export const updateAvatarURLAPI = (avatarUrl) => {
    const data = `avatarUrl=${encodeURIComponent(avatarUrl)}`
    return http({
        url: '/user/avatar',
        method: 'PUT',
        data: data,
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}