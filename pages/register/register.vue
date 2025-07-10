<template>
	<view class="register-container">
		<!-- 顶部背景 -->
		<view class="top-bg"></view>
		
		<!-- 注册表单区域 -->
		<view class="register-box">
			<view class="title">账号注册</view>
			<view class="subtitle">欢迎加入健康管理</view>
			
			<uni-forms ref="form" :model="formData">
				<view class="input-box">
					<uni-icons type="person" size="20" color="#999"></uni-icons>
					<uni-easyinput v-model="formData.username" 
						placeholder="请输入用户名" 
						:clearable="true"
					></uni-easyinput>
				</view>
				
				<view class="input-box">
					<uni-icons type="locked" size="20" color="#999"></uni-icons>
					<uni-easyinput v-model="formData.password" 
						type="password"
						placeholder="请输入密码" 
						:clearable="true"
					></uni-easyinput>
				</view>
				
				<view class="input-box">
					<uni-icons type="locked" size="20" color="#999"></uni-icons>
					<uni-easyinput v-model="formData.confirmPassword" 
						type="password"
						placeholder="请确认密码" 
						:clearable="true"
					></uni-easyinput>
				</view>
			</uni-forms>
			
			<!-- 注册按钮 -->
			<button class="register-btn" @click="handleRegister">注 册</button>
			
			<!-- 返回登录 -->
			<view class="login-link">
				<text>已有账号？</text>
				<text class="link" @click="goLogin">返回登录</text>
			</view>
		</view>
	</view>
</template>

<script>
import { registerAPI } from '@/api/user.js'

export default {
	data() {
		return {
			formData: {
				username: '',
				password: '',
				confirmPassword: ''
			}
		}
	},
	methods: {
		async handleRegister() {
			// 1. 表单验证
			if (!this.formData.username || !this.formData.password || !this.formData.confirmPassword) {
				uni.showToast({
					title: '请填写完整信息',
					icon: 'none'
				})
				return
			}
			
			if (this.formData.password !== this.formData.confirmPassword) {
				uni.showToast({
					title: '两次密码不一致',
					icon: 'none'
				})
				return
			}
			
			try {
				// 2. 发送注册请求
				await registerAPI({
					username: this.formData.username,
					password: this.formData.password
				})
				
				// 3. 提示注册成功
				uni.showToast({
					title: '注册成功',
					icon: 'success'
				})
				
				// 4. 跳转到登录页
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)
				
			} catch (error) {
				// 注册失败不需要处理，因为请求函数内部已经做了错误提示
			}
		},
		goLogin() {
			uni.navigateBack()
		}
	}
}
</script>

<style lang="scss">
.register-container {
	min-height: 100vh;
	background-color: #f5f5f5;
	
	.top-bg {
		height: 250rpx;
		background: linear-gradient(180deg, #1aa7e3 0%, #1aa7e3 100%);
		border-bottom-left-radius: 40rpx;
		border-bottom-right-radius: 40rpx;
	}
	
	.register-box {
		position: relative;
		margin: -80rpx 40rpx 0;
		padding: 60rpx 40rpx;
		background: #fff;
		border-radius: 20rpx;
		box-shadow: 0 0 20rpx rgba(0,0,0,0.1);
		
		.title {
			font-size: 44rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 20rpx;
		}
		
		.subtitle {
			font-size: 28rpx;
			color: #999;
			margin-bottom: 60rpx;
		}
		
		.input-box {
			display: flex;
			align-items: center;
			margin-bottom: 40rpx;
			padding: 20rpx 30rpx;
			background: #f8f8f8;
			border-radius: 40rpx;
			
			.uni-icons {
				margin-right: 20rpx;
			}
			
			.uni-easyinput {
				flex: 1;
			}
		}
		
		.register-btn {
			height: 90rpx;
			line-height: 90rpx;
			background: #1aa7e3;
			color: #fff;
			font-size: 32rpx;
			border-radius: 45rpx;
			margin: 60rpx 0;
		}
		
		.login-link {
			text-align: center;
			font-size: 26rpx;
			color: #666;
			
			.link {
				color: #1aa7e3;
				margin-left: 10rpx;
			}
		}
	}
}

// 去除 easyinput 默认边框
:deep(.uni-easyinput__content) {
	border: none !important;
	background-color: transparent !important;
}
</style> 