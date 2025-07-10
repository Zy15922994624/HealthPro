import store from '@/store'

const baseURL = 'http://localhost:8080'
// const baseURL = 'http://192.168.1.7:8080'
// const baseURL = 'http://192.168.0.192:8080'
const httpInterceptor = {
    invoke(options) {
        if (!options.url.startsWith('http')) {
            options.url = baseURL + options.url
        }
        options.header = {
            ...options.header,
            'source-client': 'miniapp'
        }
        const token = store.getters['user/getToken']
        if (token) {
            options.header.Authorization = token
        }
    }
}

uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)

export const http = (options) => {
    return new Promise((resolve, reject) => {
        const token = store.state.user.token
        
        if (!options.url.includes('/login') && !token) {
            setTimeout(() => {
                http(options).then(resolve).catch(reject)
            }, 100)
            return
        }

        uni.request({
            ...options,
            success(res) {
                if (res.statusCode === 200) {
                    if (res.data.code === 0) {
                        resolve(res.data)
                    } else if (res.data.code === 1) {
                        uni.showToast({
                            title: res.data.msg || '业务失败',
                            icon: 'none'
                        })
                        reject(res.data)
                    }
                } else if (res.statusCode === 401) {
                    uni.showToast({
                        title: '请先登录',
                        icon: 'none'
                    })
                    store.dispatch('user/logout')
                    reject(res)
                } else {
                    uni.showToast({
                        title: '服务异常',
                        icon: 'none'
                    })
                    reject(res)
                }
            },
            fail(err) {
                console.log('请求详细信息:', {
                    url: options.url,
                    method: options.method,
                    data: options.data,
                    error: err
                })
                uni.showToast({
                    title: '网络错误，换个网络试试',
                    icon: 'none'
                })
                reject(err)
            }
        })
    })
} 