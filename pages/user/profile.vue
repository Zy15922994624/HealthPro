<template>
	<view class="profile-container">
		<uni-forms ref="form" :model="formData">
			<uni-forms-item label="头像">
				<view class="avatar-upload" @click="handleAvatar">
					<image-loader 
						:src="formData.avatar"
						mode="aspectFill"
						width="150rpx"
						height="150rpx"
						radius="75rpx"
						style="margin-bottom: 20rpx;"
					></image-loader>
					<text>点击更换头像</text>
				</view>
			</uni-forms-item>
			
			<uni-forms-item label="昵称">
				<uni-easyinput v-model="formData.nickname" placeholder="请输入昵称"></uni-easyinput>
			</uni-forms-item>
			
			<uni-forms-item label="性别">
				<uni-data-checkbox v-model="formData.gender" :localdata="genderOptions"></uni-data-checkbox>
			</uni-forms-item>
			
			<uni-forms-item label="年龄">
				<uni-easyinput v-model="formData.age" type="number" placeholder="请输入年龄">
					<text slot="right" class="unit">岁</text>
				</uni-easyinput>
			</uni-forms-item>
			
			<uni-forms-item label="身高">
				<uni-easyinput v-model="formData.height" type="number" placeholder="请输入身高">
					<text slot="right" class="unit">cm</text>
				</uni-easyinput>
			</uni-forms-item>
			
			<uni-forms-item label="体重">
				<uni-easyinput v-model="formData.weight" type="number" placeholder="请输入体重">
					<text slot="right" class="unit">kg</text>
				</uni-easyinput>
			</uni-forms-item>
			
			<uni-forms-item label="手机号">
				<uni-easyinput v-model="formData.phone" type="number" maxlength="11" placeholder="请输入手机号"></uni-easyinput>
			</uni-forms-item>
		</uni-forms>
		
		<button class="save-btn" @click="handleSave">保存修改</button>
	</view>
</template>

<script>
import store from '@/store'
import { updateUserInfoAPI, uploadAvatarAPI, updateAvatarURLAPI } from '@/api/user.js'
import ImageLoader from '@/components/ImageLoader.vue'

export default {
	components: {
		ImageLoader
	},
	data() {
		// 从 store 中获取用户信息初始值
		const userInfo = store.state.user.userInfo || {
			avatar: '',
			nickname: '',
			gender: 0,
			age: '',
			height: '',
			weight: '',
			phone: ''
		}
		return {
			formData: JSON.parse(JSON.stringify(userInfo)),  // 深拷贝
			genderOptions: [
				{ text: '女', value: 0 },
				{ text: '男', value: 1 }
			]
		}
	},
	methods: {
		//头像地址更新
		async updateAvatarURL() {
			// 直接传递 avatar URL
			console.log('头像地址：', this.formData.avatar)
			await updateAvatarURLAPI(this.formData.avatar)
		},

		async handleAvatar() {
			try {
				// 1. 选择图片
				const res = await new Promise((resolve, reject) => {
					uni.chooseImage({
						count: 1,
						sizeType: ['compressed'],
						success: (res) => {
							console.log('选择图片成功：', res)
							resolve(res)
						},
						fail: (err) => {
							console.log('选择图片失败：', err)
							reject(err)
						}
					})
				})
				
				// 2. 检查是否有选择的图片
				if (!res.tempFilePaths || !res.tempFilePaths[0]) {
					throw new Error('未选择图片')
				}
				
				// 3. 上传图片
				uni.showLoading({ title: '上传中...' })
				const fileName = await uploadAvatarAPI(res.tempFilePaths[0])
				
				// 4. 检查上传结果
				if (!fileName) {
					throw new Error('上传失败')
				}
				
				// 5. 更新表单数据
				this.formData.avatar = 'http://localhost:8080/file/download/' + fileName
				
				// 6. 更新头像地址	
				await this.updateAvatarURL()
				store.commit('user/setUserInfo', this.formData)
				
				// 7. 隐藏加载提示，显示成功提示
				uni.hideLoading()
				uni.showToast({
					title: '上传成功',
					icon: 'success'
				})
				
			} catch (error) {
				console.log('头像上传错误：', error)
				uni.hideLoading()
				uni.showToast({
					title: error.message || '上传失败',
					icon: 'error'
				})
			}
		},
		async handleSave() {
			try {
				// 1. 发送更新请求
				await updateUserInfoAPI(this.formData)
				
				// 2. 更新 store 中的用户信息
				store.commit('user/setUserInfo', this.formData)
				
				// 3. 提示成功并返回
				uni.showToast({
					title: '保存成功',
					icon: 'success'
				})
				setTimeout(() => uni.navigateBack(), 1500)
				
			} catch (error) {
				uni.showToast({
					title: '保存失败',
					icon: 'error'
				})
			}
		}
	}
}
</script>

<style lang="scss">
.profile-container {
	padding: 30rpx;
	
	.avatar-upload {
		display: flex;
		flex-direction: column;
		align-items: center;
		
		image {
			width: 150rpx;
			height: 150rpx;
			border-radius: 75rpx;
			margin-bottom: 20rpx;
		}
		
		text {
			font-size: 24rpx;
			color: #666;
		}
	}
	
	.save-btn {
		margin-top: 60rpx;
		background: #1aa7e3;
		color: #fff;
	}
	
	.unit {
		color: #666;
		font-size: 26rpx;
		padding-right: 10rpx;
	}
}
</style> 