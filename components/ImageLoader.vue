<template>
    <image 
        :src="localPath" 
        :mode="mode"
        @error="handleError"
        class="image-loader"
    ></image>
</template>

<script>
import store from '@/store'

export default {
    name: 'ImageLoader',
    props: {
        src: {
            type: String,
            default: ''
        },
        mode: {
            type: String,
            default: 'aspectFill'
        },
        width: {
            type: String,
            default: '150rpx'
        },
        height: {
            type: String,
            default: '150rpx'
        },
        radius: {
            type: String,
            default: '75rpx'
        }
    },
    data() {
        return {
            localPath: '/static/images/default-avatar.png'
        }
    },
    watch: {
        src: {
            immediate: true,
            handler(newUrl) {
                if (newUrl && newUrl.startsWith('http')) {
                    this.downloadImage(newUrl)
                } else if (newUrl) {
                    this.localPath = newUrl
                } else {
                    this.localPath = '/static/images/default-avatar.png'
                }
            }
        }
    },
    methods: {
        async downloadImage(url) {
            try {
                const res = await uni.downloadFile({
                    url: url,
                    header: {
                        'Authorization': store.getters['user/getToken']
                    }
                })
                if (res.statusCode === 200) {
                    this.localPath = res.tempFilePath
                }
            } catch (error) {
                console.error('图片下载失败：', error)
                this.handleError()
            }
        },
        handleError() {
            this.localPath = '/static/images/default-avatar.png'
            this.$emit('error')
        }
    }
}
</script>

<style>
.image-loader {
    width: v-bind(width);
    height: v-bind(height);
    border-radius: v-bind(radius);
}
</style> 