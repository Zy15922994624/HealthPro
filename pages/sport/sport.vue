<template>
	<view class="sport-container">
		<!-- 运动状态区域 -->
		<view class="sport-status" v-if="isRecording">
			<view class="timer">{{ formatDuration(duration) }}</view>
			<view class="sport-type">{{ currentSportName }}</view>
			<button class="stop-btn" @click="stopSport">结束运动</button>
		</view>

		<!-- 原有的统计区域 -->
		<view class="stats-card" v-else>
			<!-- 运动统计卡片 -->
			<view class="stat-card">
				<view class="stat-item">
					<text class="label">消耗热量</text>
					<text class="value">{{ todayCalories.toFixed(2) }}千卡</text>
				</view>
				<view class="stat-item">
					<text class="label">运动时长</text>
					<text class="value">{{ todayDuration }}分钟</text>
				</view>
			</view>

			<!-- 记录运动按钮 -->
			<button class="start-btn" @click="showStartPopup">开始运动</button>
		</view>

		<!-- 开始运动选择弹窗 -->
		<uni-popup ref="startPopup" type="bottom">
			<view class="start-form">
				<view class="form-header">
					<text class="title">选择运动类型</text>
					<text class="close" @click="$refs.startPopup.close()">×</text>
				</view>
				<view class="sport-list">
					<view class="sport-item" v-for="item in sportTypes" :key="item.id" @click="startSport(item)">
						<text>{{ item.name }}</text>
					</view>
				</view>
			</view>
		</uni-popup>

		<!-- 结束运动表单弹窗 -->
		<uni-popup ref="endPopup" type="bottom">
			<view class="end-form">
				<view class="form-header">
					<text class="title">运动完成</text>
					<text class="close" @click="$refs.endPopup.close()">×</text>
				</view>
				<view class="form-content">
					<view class="info-item">
						<text class="label">运动时长</text>
						<text class="value">{{ formatDuration(duration) }}</text>
					</view>
					<view class="form-item">
						<text class="label">运动强度</text>
						<radio-group class="intensity-group" @change="onIntensityChange">
							<label v-for="item in intensityList" :key="item.value" class="intensity-item">
								<radio :value="item.value.toString()" :checked="formData.intensity === item.value"
									color="#07c160" />
								<text>{{ item.label }}</text>
							</label>
						</radio-group>
					</view>
					<view class="form-item">
						<text class="label">心率</text>
						<input type="number" v-model="formData.heartRate" placeholder="请输入心率" class="input-field"
							maxlength="3" />
					</view>
					<view class="form-item">
						<text class="label">备注</text>
						<textarea v-model="formData.remark" placeholder="请输入备注" />
					</view>
					<button class="submit-btn" @click="submitRecord">保存记录</button>
				</view>
			</view>
		</uni-popup>

		<!-- 运动记录列表 -->
		<view class="sport-list">
			<view class="empty" v-if="sportList.length === 0">
				<text>暂无运动记录</text>
			</view>
			<view v-else>
				<view class="sport-item" v-for="(item, index) in sportList" :key="index" @click="onRecordClick(item)">
					<view class="sport-info">
						<text class="sport-name">{{ item.sportName }}</text>
						<text class="sport-time">{{ formatTime(item.createTime) }}</text>
					</view>
					<view class="sport-data">
						<text class="duration">{{ item.duration }}分钟</text>
						<text class="calories">{{ item.calories }}千卡</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 运动记录详情弹窗 -->
		<uni-popup ref="detailPopup" type="bottom">
			<view class="detail-form">
				<view class="form-header">
					<text class="title">运动详情</text>
					<text class="close" @click="$refs.detailPopup.close()">×</text>
				</view>
				<view class="detail-content" v-if="currentRecord">
					<view class="detail-item">
						<text class="label">运动类型</text>
						<text class="value">{{ currentRecord.sportName }}</text>
					</view>
					<view class="detail-item">
						<text class="label">开始时间</text>
						<text class="value">{{ formatTime(currentRecord.startTime) }}</text>
					</view>
					<view class="detail-item">
						<text class="label">结束时间</text>
						<text class="value">{{ formatTime(currentRecord.endTime) }}</text>
					</view>
					<view class="detail-item">
						<text class="label">运动时长</text>
						<text class="value">{{ currentRecord.duration }}分钟</text>
					</view>
					<view class="detail-item">
						<text class="label">运动强度</text>
						<text class="value">{{ ['轻度', '中度', '重度'][currentRecord.intensity - 1] }}</text>
					</view>
					<view class="detail-item">
						<text class="label">心率</text>
						<text class="value">{{ currentRecord.heartRate }}次/分</text>
					</view>
					<view class="detail-item">
						<text class="label">消耗热量</text>
						<text class="value">{{ currentRecord.calories.toFixed(2) }}千卡</text>
					</view>
					<view class="detail-item" v-if="currentRecord.remark">
						<text class="label">备注</text>
						<text class="value">{{ currentRecord.remark }}</text>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { addSportRecordAPI, deleteSportRecordAPI } from '@/api/sport.js'

export default {
	data() {
		return {
			todayCalories: 0,
			todayDuration: 0,
			formData: {
				sportType: '',
				startTime: '',
				endTime: '',
				intensity: 1,
				heartRate: '',
				remark: ''
			},

			intensityList: [
				{ value: 1, label: '轻度' },
				{ value: 2, label: '中度' },
				{ value: 3, label: '重度' }
			],
			rules: {
				sportType: [{ required: true, message: '请选择运动类型' }],
				startTime: [{ required: true, message: '请选择开始时间' }],
				endTime: [{ required: true, message: '请选择结束时间' }],
				intensity: [{ required: true, message: '请选择运动强度' }]
			},
			swipeOptions: [
				{
					text: '删除',
					style: {
						backgroundColor: '#fa3534'
					}
				}
			],
			currentRecord: null, // 当前查看的记录
			isRecording: false,
			startTime: null,
			duration: 0,
			timer: null,
			currentSportName: '',
			currentSportType: null
		}
	},
	computed: {
		...mapState('sport', ['sportList', 'todayStats', 'sportTypes'])
	},
	onLoad() {
		this.loadSportRecords()
		this.initSportTypes()
	},
	// 添加下拉刷新
	onPullDownRefresh() {
		this.loadSportRecords().finally(() => {
			uni.stopPullDownRefresh()
		})
	},
	methods: {
		...mapActions('sport', ['loadSportList', 'calculateTodayStats', 'getSportTypes']),

		// 加载运动记录列表
		async loadSportRecords() {
			await this.loadSportList()
			this.calculateTodayStats()
		},

		// 计算今日运动统计
		calculateTodayStats() {
			this.todayCalories = this.todayStats.calories
			this.todayDuration = this.todayStats.duration
		},

		// 获取运动类型列表 - 改名为 initSportTypes
		async initSportTypes() {
			try {
				await this.getSportTypes()  // 调用 store action
			} catch (error) {
				uni.showToast({
					title: '加载运动类型失败',
					icon: 'none'
				})
			}
		},

		// 获取运动类型名称
		getSportTypeName(type) {
			console.log('运动类型列表:', this.sportTypes)
			console.log('要查找的type:', type)
			if (!this.sportTypes || !this.sportTypes.length) return '未知运动'
			const sportType = this.sportTypes.find(item => item.id === type)
			console.log('找到的运动类型:', sportType)
			return sportType ? sportType.name : '未知运动'
		},

		// 格式化时间
		formatTime(time) {
			const date = new Date(time)
			const year = date.getFullYear()
			const month = String(date.getMonth() + 1).padStart(2, '0')
			const day = String(date.getDate()).padStart(2, '0')
			const hour = String(date.getHours()).padStart(2, '0')
			const minute = String(date.getMinutes()).padStart(2, '0')
			return `${year}-${month}-${day} ${hour}:${minute}`
		},

		// 显示开始运动弹窗
		showStartPopup() {
			this.$refs.startPopup.open()
		},

		// 开始运动
		startSport(sportType) {
			this.currentSportType = sportType.id
			this.currentSportName = sportType.name
			this.startTime = new Date()
			this.isRecording = true
			this.duration = 0
			this.$refs.startPopup.close()

			// 开始计时
			this.timer = setInterval(() => {
				this.duration = Math.floor((new Date() - this.startTime) / 1000)
			}, 1000)
		},

		// 结束运动
		stopSport() {
			clearInterval(this.timer)
			this.isRecording = false

			// 重置表单数据
			this.formData = {
				sportType: this.currentSportType,
				startTime: this.startTime.toISOString().replace('T', ' ').substring(0, 19),
				endTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
				intensity: 1,
				heartRate: '',
				remark: ''
			}

			// 显示结束运动表单
			this.$refs.endPopup.open()
		},

		// 格式化时长显示
		formatDuration(seconds) {
			const hours = Math.floor(seconds / 3600)
			const minutes = Math.floor((seconds % 3600) / 60)
			const secs = seconds % 60
			return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
		},

		// 查看记录详情
		showDetail(record) {
			this.currentRecord = record
			this.$refs.detailPopup.open()
		},

		// 在运动记录列表的点击事件中调用
		onRecordClick(item) {
			this.showDetail(item)
		},

		onIntensityChange(e) {
			this.formData.intensity = Number(e.detail.value)
		},

		// 提交表单
		async submitRecord() {
			try {
				if (!this.validateTime()) return

				// 构造请求参数
				const params = {
					sportType: Number(this.formData.sportType),
					startTime: this.formData.startTime,
					endTime: this.formData.endTime,
					intensity: Number(this.formData.intensity),
					heartRate: Number(this.formData.heartRate) || 0,
					remark: this.formData.remark
				}

				await addSportRecordAPI(params)
				uni.showToast({
					title: '添加成功',
					icon: 'success'
				})
				this.$refs.endPopup.close()
				this.loadSportRecords()
			} catch (error) {
				uni.showToast({
					title: error.message || '添加失败',
					icon: 'none'
				})
			}
		},

		// 验证时间
		validateTime() {
			if (!this.formData.startTime || !this.formData.endTime) {
				uni.showToast({
					title: '请选择开始和结束时间',
					icon: 'none'
				})
				return false
			}

			const start = new Date(this.formData.startTime)
			const end = new Date(this.formData.endTime)
			if (end <= start) {
				uni.showToast({
					title: '结束时间必须大于开始时间',
					icon: 'none'
				})
				return false
			}

			return true
		}
	}
}
</script>

<style lang="scss">
.sport-container {
	padding: 30rpx;
	min-height: 100vh;
	background-color: #f5f5f5;

	.stat-card {
		background-color: #fff;
		border-radius: 12rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
		display: flex;
		justify-content: space-around;
		align-items: center;

		.stat-item {
			text-align: center;
			flex: 1;
			position: relative;

			&:first-child::after {
				content: '';
				position: absolute;
				right: 0;
				top: 50%;
				transform: translateY(-50%);
				width: 1px;
				height: 60%;
				background-color: #eee;
			}

			.label {
				font-size: 28rpx;
				color: #666;
				margin-bottom: 16rpx;
				display: block;
			}

			.value {
				font-size: 48rpx;
				color: #333;
				font-weight: bold;
				display: block;
			}
		}
	}

	.sport-list {
		background-color: #fff;
		border-radius: 12rpx;
		margin-top: 30rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

		.sport-item {
			padding: 30rpx;
			border-bottom: 1px solid #eee;

			&:active {
				background-color: #f9f9f9;
			}

			.sport-info {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 16rpx;

				.sport-name {
					font-size: 32rpx;
					color: #333;
					font-weight: 500;
				}

				.sport-time {
					font-size: 24rpx;
					color: #999;
				}
			}

			.sport-data {
				display: flex;
				justify-content: space-between;
				align-items: center;

				text {
					font-size: 28rpx;
					color: #666;
				}
			}
		}

		.empty {
			padding: 60rpx;
			text-align: center;
			color: #999;
			font-size: 28rpx;
		}
	}

	.start-btn {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		background-color: #07c160;
		color: #fff;
		border-radius: 44rpx;
		margin: 30rpx 0;
		font-size: 32rpx;
	}
}

// 运动状态样式
.sport-status {
	background-color: #fff;
	border-radius: 12rpx;
	padding: 40rpx;
	text-align: center;
	margin-bottom: 30rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

	.timer {
		font-size: 72rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
	}

	.sport-type {
		font-size: 32rpx;
		color: #666;
		margin-bottom: 40rpx;
	}

	.stop-btn {
		width: 80%;
		height: 88rpx;
		line-height: 88rpx;
		background-color: #ff4d4f;
		color: #fff;
		border-radius: 44rpx;
		font-size: 32rpx;
	}
}

.start-form {
	background-color: #fff;
	min-height: 60vh;
	padding: 30rpx;
	border-radius: 20rpx 20rpx 0 0;

	.sport-list {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20rpx;
		padding: 20rpx 0;

		.sport-item {
			height: 120rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #f5f5f5;
			border-radius: 8rpx;
			font-size: 28rpx;

			&:active {
				background-color: #e0e0e0;
			}
		}
	}
}

.end-form {
	background-color: #fff;
	min-height: 60vh;
	padding: 30rpx;
	border-radius: 20rpx 20rpx 0 0;

	.form-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;

		.title {
			font-size: 32rpx;
			font-weight: bold;
		}

		.close {
			font-size: 40rpx;
			color: #999;
			padding: 10rpx;
		}
	}

	.form-content {
		.info-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 0;
			border-bottom: 1px solid #eee;

			.label {
				color: #666;
				font-size: 28rpx;
			}

			.value {
				color: #333;
				font-size: 28rpx;
				font-weight: 500;
			}
		}

		.form-item {
			margin-bottom: 30rpx;

			.label {
				display: block;
				margin-bottom: 10rpx;
				font-size: 28rpx;
				color: #333;
				position: relative;
				z-index: 1;
			}

			.input-field {
				width: 100%;
				height: 88rpx;
				line-height: 88rpx;
				padding: 0 30rpx;
				background-color: #f5f5f5;
				border-radius: 8rpx;
				box-sizing: border-box;
				font-size: 28rpx;
			}

			textarea {
				width: 100%;
				height: 160rpx;
				padding: 20rpx 30rpx;
				background-color: #f5f5f5;
				border-radius: 8rpx;
				box-sizing: border-box;
				font-size: 28rpx;
			}

			.intensity-group {
				display: flex;
				flex-wrap: wrap;
				gap: 40rpx;
				padding: 20rpx 0;

				.intensity-item {
					display: flex;
					align-items: center;
					gap: 12rpx;

					radio {
						transform: scale(0.9);
					}

					text {
						font-size: 28rpx;
					}
				}
			}
		}

		.submit-btn {
			width: 100%;
			height: 88rpx;
			line-height: 88rpx;
			background-color: #07c160;
			color: #fff;
			border-radius: 44rpx;
		}
	}
}

.detail-form {
	background-color: #fff;
	min-height: 60vh;
	padding: 30rpx;
	border-radius: 20rpx 20rpx 0 0;

	.form-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;

		.title {
			font-size: 32rpx;
			font-weight: bold;
		}

		.close {
			font-size: 40rpx;
			color: #999;
			padding: 10rpx;
		}
	}

	.detail-content {
		.detail-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 0;
			border-bottom: 1px solid #eee;

			.label {
				color: #666;
				font-size: 28rpx;
			}

			.value {
				color: #333;
				font-size: 28rpx;
				font-weight: 500;
			}
		}
	}
}
</style>