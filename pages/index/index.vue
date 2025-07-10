<template>
	<view class="container">
		<!-- 今日饮食卡片 -->
		<view class="card diet-card">
			<view class="card-header">
				<text class="title">今日饮食</text>
				<text class="more" @click="navigateTo('/pages/diet/diet')">查看详情 ></text>
			</view>
			<view class="meal-buttons">
				<view class="meal-btn" v-for="meal in mealTypes" :key="meal.type" @click="showAddForm(meal.type)">
					<text class="meal-name">{{ meal.name }}</text>
					<text class="meal-status">{{ getMealStatus(meal.type) }}</text>
				</view>
			</view>
			<view class="nutrition-info">
				<view class="nutrition-item">
					<text class="label">热量</text>
					<text class="value">{{ todayStats.calories || '--' }}</text>
					<text class="unit">千卡</text>
				</view>
				<view class="nutrition-item">
					<text class="label">蛋白质</text>
					<text class="value">{{ todayStats.protein || '--' }}</text>
					<text class="unit">g</text>
				</view>
				<view class="nutrition-item">
					<text class="label">碳水</text>
					<text class="value">{{ todayStats.carbohydrate || '--' }}</text>
					<text class="unit">g</text>
				</view>
			</view>
		</view>

		<!-- 健康数据卡片 -->
		<view class="card health-card">
			<view class="card-header">
				<text class="title">健康概览</text>
				<text class="more" @click="navigateToHealth">查看详情 ></text>
			</view>
			<view class="health-grid">
				<!-- BMI -->
				<view class="health-item">
					<text class="label">BMI指数</text>
					<view class="value-wrap">
						<text class="value" :class="latestHealth.bmiStatus">{{ latestHealth.bmi || '--' }}</text>
						<text class="status">{{ evaluation.bmiStatus || '暂无数据' }}</text>
					</view>
				</view>
				<!-- 血压 -->
				<view class="health-item">
					<text class="label">血压</text>
					<view class="value-wrap">
						<text class="value" :class="latestHealth.bloodPressureStatus">
							{{ latestHealth.bloodPressureSystolic || '--' }}/{{ latestHealth.bloodPressureDiastolic
								|| '--' }}
						</text>
						<text class="status">{{ evaluation.bloodPressureStatus || '暂无数据' }}</text>
					</view>
				</view>
			</view>
			<view class="record-info">
				<text class="record-time">{{ formatDateTimeToYMD(latestHealth.recordTime) }}</text>
			</view>
		</view>

		<!-- 趋势图表 -->
		<view class="card trend-card" v-show="!isAddFormVisible">
			<view class="card-header">
				<text class="title">趋势分析</text>
			</view>

			<!-- 指标切换 -->
			<view class="indicator-tabs">
				<view v-for="item in indicators" :key="item.key"
					:class="['tab-item', currentIndicator === item.key ? 'active' : '']"
					@click="switchIndicator(item.key)">
					{{ item.name }}
				</view>
			</view>

			<!-- 图表区域 -->
			<swiper class="charts-swiper" :current="swiperCurrent" @change="onSwiperChange" :circular="false"
				:skip-hidden-item-layout="true" :display-multiple-items="1" :next-margin="0" :previous-margin="0">
				<swiper-item v-for="(item, index) in indicators" :key="item.key">
					<view class="chart-container">
						<qiun-data-charts type="line" :chartData="trendData[item.key]" :opts="chartOpts[item.key]"
							:canvas2d="true" :canvasId="'trend-chart-' + index" />
					</view>
				</swiper-item>
			</swiper>
		</view>

		<!-- 添加记录弹窗 -->
		<uni-popup ref="addPopup" type="bottom" @change="onPopupChange">
			<view class="add-form">
				<view class="form-header">
					<text class="title">{{ getMealTypeName(currentMealType) }}</text>
					<text class="close" @click="$refs.addPopup.close()">×</text>
				</view>

				<!-- 食物搜索区域 -->
				<view class="search-box">
					<input type="text" v-model="searchKey" placeholder="搜索食物" @input="onSearch" class="search-input" />
				</view>

				<!-- 搜索结果列表 -->
				<scroll-view scroll-y class="food-list" v-if="searchKey && filteredFoods.length">
					<view class="food-item" v-for="food in filteredFoods" :key="food.id" @click="selectFood(food)">
						<text class="name">{{ food.name }}</text>
						<text class="calories">{{ food.calories }}千卡/100g</text>
					</view>
				</scroll-view>

				<!-- 无搜索结果提示 -->
				<view class="no-result" v-else-if="searchKey">
					<text>未找到相关食物</text>
				</view>

				<!-- 已选食物表单 -->
				<view class="selected-food" v-if="formData.foodId">
					<view class="food-info">
						<text class="name">{{ selectedFoodName }}</text>
						<text class="unit">每100g</text>
					</view>
					<view class="nutrition-info">
						<text>热量: {{ selectedFood.calories }}千卡</text>
						<text>蛋白质: {{ selectedFood.protein }}g</text>
						<text>脂肪: {{ selectedFood.fat }}g</text>
						<text>碳水: {{ selectedFood.carbohydrate }}g</text>
					</view>
					<view class="weight-input">
						<text class="label">食用重量(g)</text>
						<input type="number" v-model="formData.foodWeight" @input="calculateNutrition" class="input" />
					</view>
					<view class="calculated-nutrition" v-if="formData.foodWeight">
						<text>实际摄入</text>
						<text>热量: {{ formData.calories.toFixed(1) }}千卡</text>
						<text>蛋白质: {{ formData.protein.toFixed(1) }}g</text>
						<text>脂肪: {{ formData.fat.toFixed(1) }}g</text>
						<text>碳水: {{ formData.carbohydrate.toFixed(1) }}g</text>
					</view>
				</view>

				<!-- 提交按钮 -->
				<button class="submit-btn" :disabled="!isFormValid" @click="submitForm">
					确认添加
				</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { addDietRecordAPI } from '@/api/diet'
import { getLatestHealthAPI, getHealthEvaluationAPI } from '@/api/health'
import { formatDateTime, formatDate,formatDateTimeToYMD} from '@/utils/date'
import { getHealthTrendAPI } from '@/api/health'
import { getSportTrendAPI } from '@/api/sport'
import { getDietTrendAPI } from '@/api/diet'
import { chartConfigs } from '@/utils/chartConfig'
import { calculateNutrition, validateDietForm, getInitialFormData, getMealStatus, filterFoods } from '@/utils/dietUtils'

export default {
	data() {
		return {
			mealTypes: [
				{ type: 1, name: '早餐' },
				{ type: 2, name: '午餐' },
				{ type: 3, name: '晚餐' },
				{ type: 4, name: '加餐' }
			],
			currentMealType: '',
			searchKey: '',
			formData: getInitialFormData(),
			selectedFood: null,
			latestHealth: {},
			evaluation: {},
			swiperCurrent: 0,
			currentIndicator: 'health',
			indicators: [
				{ key: 'health', name: '健康趋势' },
				{ key: 'sport', name: '运动趋势' },
				{ key: 'diet', name: '饮食趋势' }
			],
			trendData: {
				health: { categories: [], series: [], loaded: false },
				sport: { categories: [], series: [], loaded: false },
				diet: { categories: [], series: [], loaded: false }
			},
			chartOpts: chartConfigs,
			isAddFormVisible: false
		}
	},

	computed: {
		...mapState('diet', ['dietList', 'todayStats', 'foodList']),

		filteredFoods() {
			return filterFoods(this.foodList, this.searchKey)
		},

		selectedFoodName() {
			return this.selectedFood ? this.selectedFood.name : ''
		},

		isFormValid() {
			return validateDietForm(this.formData)
		}
	},

	methods: {
		...mapActions('diet', ['loadDietList', 'getFoodList', 'loadDietStats']),
		formatDateTimeToYMD,

		// 添加饮食记录
		async addDietRecord(recordData) {
			try {
				await addDietRecordAPI(recordData)
				uni.showToast({
					title: '添加成功',
					icon: 'success'
				})
				return true
			} catch (error) {
				console.error('添加记录失败:', error)
				uni.showToast({
					title: error.message || '添加失败',
					icon: 'none'
				})
				return false
			}
		},

		// 搜索处理
		onSearch() {
			if (!this.searchKey) return

			// 如果还没有食物列表数据，先获取
			if (!this.foodList.length) {
				this.getFoodList()
			}
		},

		// 修改页面跳转方法
		navigateTo(url) {
			// 检查页面是否存在
			if (url === '/pages/diet/diet') {
				uni.navigateTo({
					url: '/pages/diet/diet',
					fail: (err) => {
						console.error('页面跳转失败:', err)
						uni.showToast({
							title: '页面跳转失败',
							icon: 'none'
						})
					}
				})
			}
		},

		// 显示添加记录表单
		showAddForm(mealType) {
			this.currentMealType = mealType
			this.formData.mealType = mealType
			this.isAddFormVisible = true
			this.$refs.addPopup.open()
		},

		// 获取餐次状态
		getMealStatus(type) {
			return getMealStatus(type, this.dietList)
		},

		// 获取餐次名称
		getMealTypeName(type) {
			const meal = this.mealTypes.find(item => item.type === type)
			return meal ? meal.name : ''
		},

		// 选择食物
		selectFood(food) {
			this.selectedFood = food
			this.formData.foodId = food.id
			this.formData.foodName = food.name
			this.searchKey = ''
			this.calculateNutrition()
		},

		// 计算营养成分
		calculateNutrition() {
			if (!this.selectedFood || !this.formData.foodWeight) return

			const weight = Number(this.formData.foodWeight)
			const ratio = weight / 100

			this.formData.calories = this.selectedFood.calories * ratio
			this.formData.protein = this.selectedFood.protein * ratio
			this.formData.fat = this.selectedFood.fat * ratio
			this.formData.carbohydrate = this.selectedFood.carbohydrate * ratio
		},

		// 提交表单
		async submitForm() {
			if (!this.isFormValid) {
				uni.showToast({
					title: '请完善记录信息',
					icon: 'none'
				})
				return
			}

			try {
				const recordData = {
					mealType: this.currentMealType,
					foodName: this.selectedFood.name,
					foodWeight: this.formData.foodWeight,
					calories: this.formData.calories,
					protein: this.formData.protein,
					fat: this.formData.fat,
					carbohydrate: this.formData.carbohydrate,
					mealTime: formatDateTime(new Date()),
					remark: this.formData.remark || ''
				}

				const success = await this.addDietRecord(recordData)
				if (success) {
					this.$refs.addPopup.close()
					this.resetForm()
					await this.loadDietList()
					await this.loadDietStats()
				}
			} catch (error) {
				console.error('添加失败:', error)
				uni.showToast({
					title: error.message || '添加失败',
					icon: 'none'
				})
			}
		},

		// 重置表单
		resetForm() {
			this.searchKey = ''
			this.selectedFood = null
			this.formData = {
				mealType: '',
				foodId: '',
				foodName: '',
				foodWeight: '',
				calories: 0,
				protein: 0,
				fat: 0,
				carbohydrate: 0,
				mealTime: '',
				remark: ''
			}
		},

		// 更新饮食数据
		async updateDietData() {
			try {
				await this.loadDietStats()
			} catch (error) {
				console.error('更新饮食数据失败:', error)
			}
		},

		async loadData() {
			try {
				// 加载健康数据
				const healthRes = await getLatestHealthAPI()
				const evaluationRes = await getHealthEvaluationAPI()
				this.latestHealth = healthRes.data
				this.evaluation = evaluationRes.data
			} catch (error) {
				console.error('加载数据失败:', error)
			}
		},

		navigateToHealth() {
			uni.navigateTo({
				url: '/pages/health/health'
			})
		},

		// 新增加载指标的趋势数据方法
		async loadTrendData(type) {
			try {
				// 设置加载状态
				this.trendData[type] = {
					...this.trendData[type],
					loading: true
				}

				const params = { type: 'week' }
				let res = null

				switch (type) {
					case 'health':
						res = await getHealthTrendAPI(params)
						if (res.data) {
							this.trendData.health = {
								categories: res.data.map(item => formatDate(item.recordTime)),
								series: [
									{
										name: '体重',
										data: res.data.map(item => item.weight)
									},
									{
										name: 'BMI',
										data: res.data.map(item => item.bmi)
									},
									{
										name: '血压',
										data: res.data.map(item => item.bloodPressureSystolic)
									}
								],
								loading: false
							}
						}
						break

					case 'sport':
						res = await getSportTrendAPI(params)
						if (res.data) {
							this.trendData.sport = {
								categories: res.data.map(item => formatDate(item.recordTime)),
								series: [{
									name: '运动时长',
									data: res.data.map(item => item.duration)
								}],
								loading: false
							}
						}
						break

					case 'diet':
						res = await getDietTrendAPI(params)
						if (res.data) {
							this.trendData.diet = {
								categories: res.data.map(item => formatDate(item.recordTime)),
								series: [{
									name: '热量摄入',
									data: res.data.map(item => item.calories)
								}],
								loading: false
							}
						}
						break
				}
			} catch (e) {
				console.error(`加载${type}趋势数据失败`, e)
				// 设置加载状态为false
				this.trendData[type].loading = false
			}
		},

		// 修改切换指标方法
		async switchIndicator(key) {
			this.currentIndicator = key
			this.swiperCurrent = this.indicators.findIndex(item => item.key === key)
			// 移除重复调用
		},

		// 修改 swiper 切换事件
		async onSwiperChange(e) {
			const current = e.detail.current
			this.swiperCurrent = current
			const key = this.indicators[current].key
			this.currentIndicator = key
			// 切换时加载数据
			await this.loadTrendData(key)
		},

		onPopupChange(e) {
			this.isAddFormVisible = e.show
			if (!e.show) {
				// 关闭弹窗时重置状态
				this.currentMealType = ''
				this.searchKey = ''
				this.formData = {
					foodId: '',
					foodWeight: '',
					mealType: ''
				}
			}
		}
	},

	onShow() {
		this.loadDietList()
		if (!this.foodList.length) {
			this.getFoodList()
		}
		this.updateDietData()
		this.loadData()
		// 只加载当前显示的趋势数据
		this.loadTrendData(this.currentIndicator)
	}
}
</script>

<style lang="scss">
.container {
	padding: 30rpx;
	background-color: #f5f5f5;
}

// 卡片基础样式
.card {
	background-color: #fff;
	border-radius: 12rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;

		.title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
		}

		.more {
			font-size: 28rpx;
			color: #999;
		}
	}
}

.diet-card {
	.meal-buttons {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20rpx;
		margin-bottom: 30rpx;

		.meal-btn {
			background-color: #f8f8f8;
			border-radius: 12rpx;
			padding: 20rpx;
			text-align: center;

			.meal-name {
				font-size: 32rpx;
				color: #333;
				display: block;
				margin-bottom: 10rpx;
			}

			.meal-status {
				font-size: 24rpx;
				color: #999;
			}
		}
	}

	.nutrition-info {
		display: flex;
		justify-content: space-between;

		.nutrition-item {
			text-align: center;

			.label {
				font-size: 24rpx;
				color: #999;
				margin-bottom: 8rpx;
				display: block;
			}

			.value {
				font-size: 32rpx;
				color: #333;
				font-weight: bold;
			}

			.unit {
				font-size: 24rpx;
				color: #999;
				margin-left: 4rpx;
			}
		}
	}
}

.health-card {
	.health-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20rpx;
		margin-bottom: 30rpx;

		.health-item {
			background-color: #f8f8f8;
			border-radius: 12rpx;
			padding: 20rpx;
			text-align: center;

			.label {
				font-size: 26rpx;
				color: #666;
				margin-bottom: 10rpx;
			}

			.value-wrap {
				.value {
					font-size: 32rpx;
					font-weight: bold;

					&.normal {
						color: #07c160;
					}

					&.high {
						color: #ff5151;
					}

					&.low {
						color: #ffa600;
					}
				}

				.status {
					font-size: 24rpx;
					color: #666;
					margin-left: 10rpx;
				}
			}
		}
	}

	.record-info {
		text-align: center;
		padding: 20rpx 0;

		.record-time {
			font-size: 26rpx;
			color: #999;
		}
	}
}

.add-form {
	position: relative;
	z-index: 999 !important;
	background-color: #fff;
	min-height: 60vh;
	border-radius: 20rpx 20rpx 0 0;
	padding: 30rpx;

	.form-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;

		.title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
		}

		.close {
			font-size: 40rpx;
			color: #999;
			padding: 10rpx;
		}
	}

	.search-box {
		margin-bottom: 20rpx;

		.search-input {
			width: 100%;
			height: 80rpx;
			background-color: #f5f5f5;
			border-radius: 40rpx;
			padding: 0 30rpx;
			font-size: 28rpx;
		}
	}

	.food-list {
		max-height: 400rpx;

		.food-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx;
			border-bottom: 1px solid #eee;

			&:active {
				background-color: #f5f5f5;
			}

			.name {
				font-size: 28rpx;
				color: #333;
			}

			.calories {
				font-size: 24rpx;
				color: #999;
			}
		}
	}

	.selected-food {
		padding: 20rpx;
		background-color: #f5f5f5;
		border-radius: 12rpx;
		margin-bottom: 30rpx;

		.food-info {
			display: flex;
			justify-content: space-between;
			margin-bottom: 20rpx;

			.name {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			}

			.unit {
				font-size: 24rpx;
				color: #999;
			}
		}

		.nutrition-info {
			display: flex;
			flex-wrap: wrap;
			gap: 20rpx;
			margin-bottom: 20rpx;

			text {
				font-size: 24rpx;
				color: #666;
			}
		}

		.weight-input {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;

			.label {
				font-size: 28rpx;
				color: #333;
				margin-right: 20rpx;
			}

			.input {
				flex: 1;
				height: 80rpx;
				background-color: #fff;
				border-radius: 8rpx;
				padding: 0 20rpx;
				font-size: 28rpx;
			}
		}

		.calculated-nutrition {
			display: flex;
			flex-direction: column;
			gap: 10rpx;

			text {
				font-size: 24rpx;
				color: #666;

				&:first-child {
					color: #333;
					font-weight: bold;
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
		font-size: 32rpx;
		margin-top: 30rpx;

		&:disabled {
			background-color: #ccc;
		}
	}
}

.no-result {
	padding: 30rpx;
	text-align: center;
	color: #999;
	font-size: 28rpx;
}

.trend-card {
	position: relative;
	z-index: 1;

	.indicator-tabs {
		display: flex;
		justify-content: center;
		gap: 20rpx;
		margin: 20rpx 0;

		.tab-item {
			padding: 8rpx 24rpx;
			font-size: 28rpx;
			color: #666;
			background: #f8f8f8;
			border-radius: 24rpx;

			&.active {
				color: #1aa7e3;
				background: rgba(26, 167, 227, 0.1);
				font-weight: 500;
			}
		}
	}

	.charts-swiper {
		height: 480rpx;
		width: 100%;
		position: relative;
		z-index: 1;

		.uni-swiper-wrapper {
			overflow: hidden;
		}

		.uni-swiper-item {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100% !important;

			.chart-container {
				width: 100%;
				height: 100%;
			}
		}
	}
}

.uni-popup {
	z-index: 999 !important;
}
</style>
