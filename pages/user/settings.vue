<template>
	<view class="settings-container">
		<!-- 添加加载状态 -->
		<view class="loading" v-if="loading">
			<uni-load-more status="loading" />
		</view>

		<!-- 基础设置 -->
		<view class="settings-group">
			<view class="group-title">通知设置</view>
			<view class="settings-item">
				<text class="label">系统通知</text>
				<switch :checked="settings.enableNotification" @change="onNotificationChange" />
			</view>
		</view>

		<view class="settings-group">
			<view class="group-title">隐私设置</view>
			<view class="settings-item">
				<text class="label">数据同步</text>
				<switch :checked="settings.enableSync" @change="onSyncChange" />
			</view>
		</view>

		<view class="settings-group">
			<view class="group-title">其他设置</view>
			<view class="settings-item" @click="clearCache">
				<text class="label">清除缓存</text>
				<text class="value">{{ cacheSize }}</text>
			</view>
			<view class="settings-item">
				<text class="label">当前版本</text>
				<text class="value">v1.0.0</text>
			</view>
		</view>

		<!-- 保存按钮 -->
		<button class="save-btn" @click="saveSettings">保存设置</button>
	</view>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
	data() {
		return {
			loading: false
		}
	},
	computed: {
		...mapState('settings', ['settings'])
	},
	created() {
		this.loadSettings()
	},
	methods: {
		...mapActions('settings', ['getSettings', 'saveSettings']),
		async loadSettings() {
			this.loading = true
			try {
				await this.getSettings()
			} finally {
				this.loading = false
			}
		},
		async saveSettings() {
			// 添加loading状态
			uni.showLoading({
				title: '保存中...'
			})

			try {
				const success = await this.saveSettings(this.settings)
				if (success) {
					uni.showToast({
						title: '设置已保存',
						icon: 'success'
					})
				} else {
					uni.showToast({
						title: '保存失败',
						icon: 'error'
					})
				}
			} catch (error) {
				uni.showToast({
					title: '网络错误',
					icon: 'error'
				})
			} finally {
				uni.hideLoading()
			}
		},
		onNotificationChange(e) {
			this.settings.enableNotification = e.detail.value
		},
		onSyncChange(e) {
			this.settings.enableSync = e.detail.value
		},
		clearCache() {
			uni.showModal({
				title: '提示',
				content: '确定要清除缓存吗？',
				success: (res) => {
					if (res.confirm) {
						try {
							uni.clearStorageSync()
							uni.showToast({
								title: '清除成功',
								icon: 'success'
							})
							// 重新加载设置
							this.loadSettings()
						} catch (error) {
							uni.showToast({
								title: '清除失败',
								icon: 'error'
							})
						}
					}
				}
			})
		}
	}
}
</script>

<style lang="scss">
.settings-container {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding: 20rpx;

	.settings-group {
		background: #fff;
		border-radius: 12rpx;
		margin-bottom: 20rpx;
		padding: 0 30rpx;

		.group-title {
			font-size: 28rpx;
			color: #666;
			padding: 20rpx 0;
			border-bottom: 1rpx solid #eee;
		}

		.settings-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx 0;
			border-bottom: 1rpx solid #eee;

			&:last-child {
				border-bottom: none;
			}

			.label {
				font-size: 28rpx;
				color: #333;
			}

			input {
				text-align: right;
				width: 200rpx;
			}

			picker {
				color: #666;
			}
		}
	}

	.save-btn {
		margin-top: 40rpx;
		background: #07c160;
		color: #fff;
		border-radius: 12rpx;
	}

	.loading {
		display: flex;
		justify-content: center;
		padding: 20rpx;
	}
}
</style>