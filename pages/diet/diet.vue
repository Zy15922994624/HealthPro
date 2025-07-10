<template>
    <view class="diet-container">
        <!-- 今日统计卡片 -->
        <view class="stat-card">
            <view class="stat-header">
                <text class="title">今日摄入</text>
                <text class="date">{{ currentDate }}</text>
            </view>
            <view class="stat-content">
                <view class="stat-item">
                    <text class="label">热量</text>
                    <view class="value-box">
                        <text class="value">{{ dailyNutrition.calories }}</text>
                        <text class="unit">千卡</text>
                    </view>
                </view>
                <view class="nutrition-bar">
                    <view class="bar-item protein" :style="{ flex: dailyNutrition.protein || 0 }">
                        <text>蛋白质 {{ dailyNutrition.protein }}g</text>
                    </view>
                    <view class="bar-item fat" :style="{ flex: dailyNutrition.fat || 0 }">
                        <text>脂肪 {{ dailyNutrition.fat }}g</text>
                    </view>
                    <view class="bar-item carbs" :style="{ flex: dailyNutrition.carbs || 0 }">
                        <text>碳水 {{ dailyNutrition.carbs }}g</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 快速记录区 -->
        <view class="meal-buttons">
            <view class="meal-btn" v-for="meal in mealTypes" :key="meal.type" @click="showAddForm(meal.type)">
                <text class="meal-name">{{ meal.name }}</text>
                <text class="meal-status">{{ getMealStatus(meal.type) }}</text>
            </view>
        </view>

        <!-- 今日记录列表 -->
        <view class="diet-list">
            <view class="list-header">
                <text class="title">今日记录</text>
            </view>
            <view class="meal-group" v-for="meal in groupedRecords" :key="meal.type">
                <view class="meal-header">
                    <text class="meal-type">{{ getMealTypeName(meal.type) }}</text>
                    <text class="meal-calories">{{ meal.calories.toFixed(1) }}千卡</text>
                </view>
                <view class="food-item" v-for="food in meal.foods" :key="food.id">
                    <view class="food-info">
                        <text class="food-name">{{ food.foodName }}</text>
                        <text class="food-weight">{{ food.foodWeight }}g</text>
                    </view>
                    <view class="food-nutrition">
                        <text class="calories">{{ food.calories.toFixed(1) }}千卡</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 添加记录弹窗 -->
        <uni-popup ref="addPopup" type="bottom">
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
                        <text class="calories">{{ food.calories }}千卡/100{{ food.unit }}</text>
                    </view>
                </scroll-view>

                <!-- 无搜索结果提示 -->
                <view class="no-result" v-else-if="searchKey">
                    <text>未找到相关食物</text>
                </view>

                <!-- 已选食物表单 -->
                <view class="selected-food" v-if="selectedFood">
                    <view class="food-info">
                        <text class="name">{{ selectedFoodName }}</text>
                        <text class="unit">每100{{ selectedFood.unit }}</text>
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
                <button class="submit-btn" :disabled="!isFormValid" @click="() => submitForm()">
                    确认添加
                </button>
            </view>
        </uni-popup>
    </view>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { addDietRecordAPI, getDietStatsAPI, getDietListAPI } from '@/api/diet'

export default {
    data() {
        return {
            mealTypes: [
                { type: 1, name: '早餐' },
                { type: 2, name: '午餐' },
                { type: 3, name: '晚餐' },
                { type: 4, name: '加餐' }
            ],
            currentMealType: null,
            searchKey: '',
            formData: {
                mealType: '',
                foodName: '',
                foodWeight: '',
                calories: 0,
                protein: 0,
                fat: 0,
                carbohydrate: 0,
                mealTime: '',
                remark: ''
            },
            selectedFood: null,
            currentDate: '',
            dailyNutrition: {
                calories: '--',
                protein: '--',
                fat: '--',
                carbs: '--'
            },
            meals: [
                { name: '早餐', type: 'breakfast', recorded: false },
                { name: '午餐', type: 'lunch', recorded: false },
                { name: '晚餐', type: 'dinner', recorded: false },
                { name: '加餐', type: 'extra', recorded: false }
            ],
            todayRecords: [],
            searchQuery: ''
        }
    },

    computed: {
        ...mapState('diet', ['dietList', 'todayStats', 'foodList']),

        // 计算营养素比例
        proteinPercent() {
            const total = this.todayStats.protein + this.todayStats.fat + this.todayStats.carbohydrate
            return total ? (this.todayStats.protein / total * 100) : 0
        },
        fatPercent() {
            const total = this.todayStats.protein + this.todayStats.fat + this.todayStats.carbohydrate
            return total ? (this.todayStats.fat / total * 100) : 0
        },
        carbsPercent() {
            const total = this.todayStats.protein + this.todayStats.fat + this.todayStats.carbohydrate
            return total ? (this.todayStats.carbohydrate / total * 100) : 0
        },

        // 按餐次分组的记录
        groupedRecords() {
            const today = new Date().toISOString().split('T')[0]
            const todayRecords = this.dietList.filter(item =>
                item.mealTime.startsWith(today)
            )

            // 按餐次分组
            const groups = this.mealTypes.map(type => ({
                type: type.type,
                name: type.name,
                foods: todayRecords.filter(item => item.mealType === type.type),
                calories: todayRecords
                    .filter(item => item.mealType === type.type)
                    .reduce((sum, item) => sum + item.calories, 0)
            }))

            return groups.filter(group => group.foods.length > 0)
        },

        // 过滤后的食物列表
        filteredFoods() {
            if (!this.searchKey) {
                console.log('搜索条件不满足:', { searchKey: this.searchKey })
                return []
            }

            return this.foodList.filter(food => {
                if (!food || !food.name) return false
                return food.name.includes(this.searchKey)
            })
        },

        // 选中的食物名称
        selectedFoodName() {
            return this.selectedFood ? this.selectedFood.name : ''
        },

        // 表单验证
        isFormValid() {
            return this.selectedFood &&
                this.formData.foodWeight &&
                this.formData.foodWeight > 0 &&
                this.currentMealType
        }
    },

    methods: {
        ...mapActions('diet', ['loadDietList', 'getFoodList', 'loadDietStats']),

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

        // 显示添加记录表单
        showAddForm(mealType) {
            this.currentMealType = mealType
            this.formData.mealType = mealType
            this.$refs.addPopup.open()
        },

        // 获取餐次状态
        getMealStatus(type) {
            const records = this.dietList.filter(item => {
                const today = new Date().toISOString().split('T')[0]
                return item.mealTime.startsWith(today) && item.mealType === type
            })
            return records.length > 0 ? '已记录' : '未记录'
        },

        // 格式化日期
        formatDate(date) {
            const year = date.getFullYear()
            const month = (date.getMonth() + 1).toString().padStart(2, '0')
            const day = date.getDate().toString().padStart(2, '0')
            return `${year}-${month}-${day}`
        },

        // 获取餐次名称
        getMealTypeName(type) {
            const meal = this.mealTypes.find(item => item.type === type)
            return meal ? meal.name : ''
        },

        // 搜索处理
        async onSearch() {
            try {
                if (!this.foodList || this.foodList.length === 0) {
                    console.log('开始获取食物列表')
                    await this.getFoodList()
                    console.log('获取食物列表成功')
                }
            } catch (error) {
                console.error('搜索出错:', error)
                uni.showToast({
                    title: '获取食物列表失败',
                    icon: 'none'
                })
            }
        },

        // 选择食物
        selectFood(food) {
            this.selectedFood = food
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

        // 格式化时间
        formatDateTime(date) {
            const pad = (num) => String(num).padStart(2, '0')
            const d = date || new Date()
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
        },

        // 提交表单
        async submitForm() {
            console.log('开始提交表单')
            console.log('表单验证状态:', this.isFormValid)
            console.log('当前表单数据:', {
                selectedFood: this.selectedFood,
                currentMealType: this.currentMealType,
                formData: this.formData
            })

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
                    mealTime: this.formatDateTime(new Date()),
                    remark: this.formData.remark || ''
                }
                console.log('准备提交的数据:', recordData)

                const success = await this.addDietRecord(recordData)
                console.log('提交结果:', success)

                if (success) {
                    this.$refs.addPopup.close()
                    this.resetForm()
                    await this.loadDietData()
                    await this.loadDietStats()
                }
            } catch (error) {
                console.log('提交过程中的 this:', this)
                console.log('提交过程中的 methods:', Object.keys(this))
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

        // 初始化今日数据
        async initDailyData() {
            const now = new Date()
            this.currentDate = now.toISOString().split('T')[0]
            const lastUpdateDate = uni.getStorageSync('lastDietUpdateDate')

            if (lastUpdateDate !== this.currentDate) {
                this.dailyNutrition = {
                    calories: '--',
                    protein: '--',
                    fat: '--',
                    carbs: '--'
                }
                this.meals = this.meals.map(meal => ({
                    ...meal,
                    recorded: false
                }))
                uni.setStorageSync('lastDietUpdateDate', this.currentDate)
            }

            await this.loadDietData()
        },

        // 加载饮食数据
        async loadDietData() {
            try {
                // 获取今日饮食统计
                const statsRes = await getDietStatsAPI()
                if (statsRes.code === 0) {
                    this.dailyNutrition = {
                        calories: statsRes.data.calories || '--',
                        protein: statsRes.data.protein || '--',
                        fat: statsRes.data.fat || '--',
                        carbs: statsRes.data.carbohydrate || '--'
                    }
                }

                // 获取今日记录列表
                await this.loadDietList()

                // 加载食物列表
                if (!this.foodList.length) {
                    await this.getFoodList()
                }
            } catch (error) {
                console.error('加载饮食数据失败:', error)
                uni.showToast({
                    title: '加载数据失败',
                    icon: 'none'
                })
            }
        }
    },

    onShow() {
        this.initDailyData()
    },

    onPullDownRefresh() {
        this.loadDietList().finally(() => {
            uni.stopPullDownRefresh()
        })
    },

    async created() {
        await this.getFoodList()
    }
}
</script>

<style lang="scss">
.diet-container {
    padding: 30rpx;
    min-height: 100vh;
    background-color: #f5f5f5;

    .stat-card {
        background-color: #fff;
        border-radius: 12rpx;
        padding: 30rpx;
        margin-bottom: 30rpx;
        box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

        .stat-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20rpx;

            .title {
                font-size: 32rpx;
                font-weight: bold;
                color: #333;
            }

            .date {
                font-size: 28rpx;
                color: #999;
            }
        }

        .stat-content {
            .stat-item {
                text-align: center;
                margin-bottom: 30rpx;

                .label {
                    font-size: 28rpx;
                    color: #666;
                }

                .value {
                    font-size: 48rpx;
                    font-weight: bold;
                    color: #333;
                    margin: 0 10rpx;
                }

                .unit {
                    font-size: 24rpx;
                    color: #999;
                }
            }

            .nutrition-bar {
                height: 40rpx;
                display: flex;
                border-radius: 20rpx;
                overflow: hidden;

                .bar-item {
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: width 0.3s;

                    text {
                        font-size: 24rpx;
                        color: #fff;
                    }

                    &.protein {
                        background-color: #ff6b6b;
                    }

                    &.fat {
                        background-color: #ffd93d;
                    }

                    &.carbs {
                        background-color: #6c5ce7;
                    }
                }
            }
        }
    }

    .meal-buttons {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20rpx;
        margin-bottom: 30rpx;

        .meal-btn {
            background-color: #fff;
            border-radius: 12rpx;
            padding: 30rpx;
            text-align: center;
            box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

            .meal-name {
                font-size: 32rpx;
                font-weight: bold;
                color: #333;
                display: block;
                margin-bottom: 10rpx;
            }

            .meal-status {
                font-size: 24rpx;
                color: #999;
            }

            &:active {
                background-color: #f5f5f5;
            }
        }
    }

    .diet-list {
        background-color: #fff;
        border-radius: 12rpx;
        padding: 30rpx;
        box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

        .list-header {
            margin-bottom: 20rpx;

            .title {
                font-size: 32rpx;
                font-weight: bold;
                color: #333;
            }
        }

        .meal-group {
            margin-bottom: 30rpx;

            .meal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20rpx 0;
                border-bottom: 1px solid #eee;

                .meal-type {
                    font-size: 28rpx;
                    color: #666;
                }

                .meal-calories {
                    font-size: 28rpx;
                    color: #ff6b6b;
                }
            }

            .food-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20rpx 0;
                border-bottom: 1px solid #eee;

                .food-info {
                    .food-name {
                        font-size: 28rpx;
                        color: #333;
                        margin-bottom: 6rpx;
                    }

                    .food-weight {
                        font-size: 24rpx;
                        color: #999;
                    }
                }

                .food-nutrition {
                    .calories {
                        font-size: 28rpx;
                        color: #ff6b6b;
                    }
                }
            }
        }
    }
}

.add-form {
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
</style>