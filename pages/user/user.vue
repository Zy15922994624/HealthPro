<template>
	<view class="user-container">
		<!-- 用户信息卡片 -->
		<view class="user-card">
			<view class="avatar">
				<image-loader :src="userInfo.avatar" mode="aspectFill" width="120rpx" height="120rpx"
					radius="60rpx"></image-loader>
			</view>

			<view class="info">
				<text class="nickname">{{ userInfo.nickname || '未设置昵称' }}</text>
				<text class="userid">ID: {{ userInfo.id || '----' }}</text>
			</view>
		</view>

		<!-- 功能菜单 -->
		<view class="menu-list">
			<view class="menu-item" v-for="(item, index) in menuList" :key="index" @click="handleMenu(item)">
				<view class="left">
					<uni-icons :type="item.icon" size="20" color="#666"></uni-icons>
					<text>{{ item.name }}</text>
				</view>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
		</view>

		<!-- 退出登录 -->
		<button class="logout-btn" @click="handleLogout">退出登录</button>
	</view>
</template>

<script>
import store from '@/store'
import ImageLoader from '@/components/ImageLoader.vue'

export default {
	components: {
		ImageLoader
	},
	data() {
		return {
			menuList: [
				{ name: '个人资料', icon: 'person', path: '/pages/user/profile' },
				{ name: '健康目标', icon: 'star', path: '/pages/user/health-goals' },
				{ name: '修改密码', icon: 'locked', path: '/pages/user/password' },
				{ name: '系统设置', icon: 'gear', path: '/pages/user/settings' }
			]
		}
	},
	computed: {
		userInfo() {
			return store.state.user.userInfo || {}
		}
	},

	methods: {
		handleMenu(item) {
			uni.navigateTo({
				url: item.path
			})
		},
		handleLogout() {
			uni.showModal({
				title: '提示',
				content: '确定要退出登录吗？',
				success: (res) => {
					if (res.confirm) {
						store.dispatch('user/logout')
					}
				}
			})
		}
	}
}
</script>

<style lang="scss">
.user-container {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding: 20rpx;

	.user-card {
		display: flex;
		align-items: center;
		padding: 40rpx;
		background: #fff;
		border-radius: 12rpx;
		margin-bottom: 20rpx;

		.avatar {
			width: 120rpx;
			height: 120rpx;
			border-radius: 60rpx;
			overflow: hidden;
			margin-right: 30rpx;
			flex-shrink: 0;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.info {
			flex: 1;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.nickname {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			}

			.userid {
				font-size: 26rpx;
				color: #999;
				margin-left: auto;
			}
		}
	}

	.menu-list {
		background: #fff;
		border-radius: 12rpx;

		.menu-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx;
			border-bottom: 1rpx solid #eee;

			&:last-child {
				border-bottom: none;
			}

			.left {
				display: flex;
				align-items: center;

				.uni-icons {
					margin-right: 20rpx;
				}

				text {
					font-size: 28rpx;
					color: #333;
				}
			}
		}
	}

	.logout-btn {
		margin-top: 40rpx;
		background: #fff;
		color: #ff5151;
		font-size: 28rpx;
		border-radius: 12rpx;

		&::after {
			border: none;
		}
	}
}
</style>