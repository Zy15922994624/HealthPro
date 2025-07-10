<template>
	<view class="login-container">
		<!-- 顶部背景 -->
		<view class="top-bg"></view>

		<!-- 登录表单区域 -->
		<view class="login-box">
			<view class="title">欢迎登录</view>
			<view class="subtitle">健康管理，从这里开始</view>

			<uni-forms ref="form" :model="formData">
				<view class="input-box">
					<uni-icons type="person" size="20" color="#999"></uni-icons>
					<uni-easyinput v-model="formData.username" placeholder="请输入用户名/手机号"
						:clearable="true"></uni-easyinput>
				</view>

				<view class="input-box">
					<uni-icons type="locked" size="20" color="#999"></uni-icons>
					<uni-easyinput v-model="formData.password" type="password" placeholder="请输入密码"
						:clearable="true"></uni-easyinput>
				</view>
			</uni-forms>

			<!-- 记住密码和忘记密码 -->
			<view class="options">
				<label class="remember">
					<switch type="checkbox" :checked="remember" @change="rememberChange" style="transform:scale(0.7)" />
					<text>记住密码</text>
				</label>
				<text class="forget" @click="onForgetPassword">忘记密码？</text>
			</view>

			<!-- 登录按钮 -->
			<button class="login-btn" @click="handleLogin">登 录</button>

			<!-- 其他登录方式 -->
			<view class="other-login">
				<view class="divider">
					<text>其他登录方式</text>
				</view>
				<view class="icons">
					<uni-icons type="weixin" size="30" color="#04BE02" @click="otherLogin('weixin')"></uni-icons>
					<uni-icons type="phone" size="30" color="#11cd6e" @click="otherLogin('phone')"></uni-icons>
				</view>
			</view>

			<!-- 注册入口 -->
			<view class="register">
				<text>还没有账号？</text>
				<text class="link" @click="goRegister">立即注册</text>
			</view>
		</view>
	</view>
</template>

<script>
import { loginAPI, getUserInfoAPI } from '@/api/user.js'
import store from '@/store'
import { reminderUtils } from '@/utils/reminder'

export default {
	data() {
		return {
			formData: {
				username: '',
				password: ''
			},
			remember: false
		}
	},
	methods: {
		async handleLogin() {
			try {
				// 1. 表单验证
				if (!this.formData.username || !this.formData.password) {
					uni.showToast({
						title: '请输入用户名和密码',
						icon: 'none'
					})
					return
				}

				// 2. 发送登录请求
				const res = await loginAPI(this.formData)

				// 3. 先跳转到首页，再处理其他逻辑
				uni.reLaunch({
					url: '/pages/index/index',
					complete: async () => {
						try {
							// 4. 存储token
							store.commit('user/setToken', res.data)

							// 5. 获取用户信息
							const userInfo = await getUserInfoAPI()
							store.commit('user/setUserInfo', userInfo.data)

							// 6. 获取用户设置
							const settings = await store.dispatch('settings/getSettings')
							console.log('获取到的用户设置:', settings)

							// 7. 启动提醒检查
							console.log('准备启动提醒检查')
							reminderUtils.startChecking()
							console.log('提醒检查启动完成')

							// 8. 显示成功提示
							uni.showToast({
								title: '登录成功',
								icon: 'success'
							})
						} catch (error) {
							console.error('获取用户信息失败:', error)
						}
					}
				})
			} catch (error) {
				console.log(error)
				uni.showToast({
					title: '登录失败，请重试',
					icon: 'none'
				})
			}
		},
		rememberChange(e) {
			this.remember = e.detail.value
		},
		onForgetPassword() {
			uni.showToast({
				title: '暂未开放',
				icon: 'none'
			})
		},
		otherLogin(type) {
			uni.showToast({
				title: `${type}登录暂未开放`,
				icon: 'none'
			})
		},
		goRegister() {
			uni.navigateTo({
				url: '/pages/register/register'
			})
		}
	}
}
</script>

<style lang="scss">
.login-container {
	min-height: 100vh;
	background-color: #f5f5f5;

	.top-bg {
		height: 250rpx;
		background: linear-gradient(180deg, #1aa7e3 0%, #1aa7e3 100%);
		border-bottom-left-radius: 40rpx;
		border-bottom-right-radius: 40rpx;
	}

	.login-box {
		position: relative;
		margin: -80rpx 40rpx 0;
		padding: 60rpx 40rpx;
		background: #fff;
		border-radius: 20rpx;
		box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.1);

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

		.options {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 60rpx;

			.remember {
				display: flex;
				align-items: center;
				color: #666;
				font-size: 26rpx;
			}

			.forget {
				color: #1aa7e3;
				font-size: 26rpx;
			}
		}

		.login-btn {
			height: 90rpx;
			line-height: 90rpx;
			background: #1aa7e3;
			color: #fff;
			font-size: 32rpx;
			border-radius: 45rpx;
			margin-bottom: 60rpx;
		}

		.other-login {
			margin-bottom: 40rpx;

			.divider {
				position: relative;
				text-align: center;
				margin-bottom: 40rpx;

				&::before,
				&::after {
					content: '';
					position: absolute;
					top: 50%;
					width: 30%;
					height: 1px;
					background: #eee;
				}

				&::before {
					left: 0;
				}

				&::after {
					right: 0;
				}

				text {
					color: #999;
					font-size: 24rpx;
					padding: 0 20rpx;
					background: #fff;
				}
			}

			.icons {
				display: flex;
				justify-content: center;
				gap: 100rpx;
			}
		}

		.register {
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