<template>
    <view class="health-container">
        <!-- 最新数据卡片区 -->
        <view class="data-cards">
            <!-- BMI卡片 -->
            <view class="card">
                <view class="card-header">
                    <text class="title">BMI指数</text>
                    <text class="value" :class="latestData.bmiStatus">{{ latestData.bmi || '--' }}</text>
                </view>
                <view class="card-body">
                    <text class="label">体重：{{ latestData.weight || '--' }}kg</text>
                    <text class="status">{{ evaluation.bmiStatus || '暂无数据' }}</text>
                </view>
                <view class="card-footer">
                    <text class="reference">参考范围：{{ evaluation.bmiMin }}-{{ evaluation.bmiMax }}</text>
                </view>
            </view>

            <!-- 体脂率卡片 -->
            <view class="card">
                <view class="card-header">
                    <text class="title">体脂率</text>
                    <text class="value" :class="latestData.bodyFatStatus">{{ latestData.bodyFat || '--' }}%</text>
                </view>
                <view class="card-body">
                    <text class="status">{{ evaluation.bodyFatStatus || '暂无数据' }}</text>
                </view>
                <view class="card-footer">
                    <text class="reference">参考范围：{{ evaluation.bodyFatMin }}-{{ evaluation.bodyFatMax }}%</text>
                </view>
            </view>

            <!-- 血压卡片 -->
            <view class="card">
                <view class="card-header">
                    <text class="title">血压</text>
                    <text class="value" :class="latestData.bloodPressureStatus">
                        {{ latestData.bloodPressureSystolic || '--' }}/{{ latestData.bloodPressureDiastolic || '--' }}
                    </text>
                </view>
                <view class="card-body">
                    <text class="status">{{ evaluation.bloodPressureStatus || '暂无数据' }}</text>
                </view>
                <view class="card-footer">
                    <text class="reference">收缩压：{{ evaluation.bloodPressureSystolicMin }}-{{
                        evaluation.bloodPressureSystolicMax }}</text>
                    <text class="reference">舒张压：{{ evaluation.bloodPressureDiastolicMin }}-{{
                        evaluation.bloodPressureDiastolicMax }}</text>
                </view>
            </view>

            <!-- 心率卡片 -->
            <view class="card">
                <view class="card-header">
                    <text class="title">心率</text>
                    <text class="value" :class="latestData.heartRateStatus">{{ latestData.heartRate || '--' }}</text>
                </view>
                <view class="card-body">
                    <text class="status">{{ evaluation.heartRateStatus || '暂无数据' }}</text>
                </view>
                <view class="card-footer">
                    <text class="reference">参考范围：{{ evaluation.heartRateMin }}-{{ evaluation.heartRateMax }}</text>
                </view>
            </view>
        </view>

        <!-- 健康建议区 -->
        <view class="advice-section" v-if="hasAbnormalIndexes">
            <view class="advice-card">
                <view class="advice-header">
                    <text class="advice-title">健康建议</text>
                </view>
                <view class="advice-content">
                    <view v-if="evaluation.bmiStatus === '偏低'" class="advice-item">
                        <text class="reason">BMI指数偏低 ({{ latestData.bmi }})</text>
                        <text class="advice-text">{{ evaluation.bmiAdvice }}</text>
                    </view>
                    <view v-if="evaluation.bmiStatus === '偏高'" class="advice-item">
                        <text class="reason">BMI指数偏高 ({{ latestData.bmi }})</text>
                        <text class="advice-text">{{ evaluation.bmiAdvice }}</text>
                    </view>
                    <view v-if="evaluation.bodyFatStatus === '偏高'" class="advice-item">
                        <text class="reason">体脂率偏高 ({{ latestData.bodyFat }}%)</text>
                        <text class="advice-text">{{ evaluation.bodyFatAdvice }}</text>
                    </view>
                    <view v-if="evaluation.bodyFatStatus === '偏低'" class="advice-item">
                        <text class="reason">体脂率偏低 ({{ latestData.bodyFat }}%)</text>
                        <text class="advice-text">{{ evaluation.bodyFatAdvice }}</text>
                    </view>
                    <view v-if="evaluation.bloodPressureStatus === '偏高'" class="advice-item">
                        <text class="reason">血压偏高 ({{ latestData.bloodPressureSystolic }}/{{
                            latestData.bloodPressureDiastolic }})</text>
                        <text class="advice-text">{{ evaluation.bloodPressureAdvice }}</text>
                    </view>
                    <view v-if="evaluation.bloodPressureStatus === '偏低'" class="advice-item">
                        <text class="reason">血压偏低 ({{ latestData.bloodPressureSystolic }}/{{
                            latestData.bloodPressureDiastolic }})</text>
                        <text class="advice-text">{{ evaluation.bloodPressureAdvice }}</text>
                    </view>
                    <view v-if="evaluation.heartRateStatus === '偏高'" class="advice-item">
                        <text class="reason">心率偏高 ({{ latestData.heartRate }}次/分)</text>
                        <text class="advice-text">{{ evaluation.heartRateAdvice }}</text>
                    </view>
                    <view v-if="evaluation.heartRateStatus === '偏低'" class="advice-item">
                        <text class="reason">心率偏低 ({{ latestData.heartRate }}次/分)</text>
                        <text class="advice-text">{{ evaluation.heartRateAdvice }}</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 鼓励卡片 -->
        <view class="advice-section" v-if="hasNormalIndexes">
            <view class="advice-card">
                <view class="advice-header">
                    <text class="advice-title">继续保持</text>
                </view>
                <view class="encourage-content">
                    <view v-if="evaluation.bmiStatus === '正常'" class="encourage-item">
                        <text class="normal-text">BMI指数正常，{{ evaluation.bmiAdvice }}</text>
                    </view>
                    <view v-if="evaluation.bodyFatStatus === '正常'" class="encourage-item">
                        <text class="normal-text">体脂率正常，{{ evaluation.bodyFatAdvice }}</text>
                    </view>
                    <view v-if="evaluation.bloodPressureStatus === '正常'" class="encourage-item">
                        <text class="normal-text">血压正常，{{ evaluation.bloodPressureAdvice }}</text>
                    </view>
                    <view v-if="evaluation.heartRateStatus === '正常'" class="encourage-item">
                        <text class="normal-text">心率正常，{{ evaluation.heartRateAdvice }}</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 记录按钮 -->
        <button class="record-btn" @click="showRecordForm">记录健康数据</button>

        <!-- 记录表单弹窗 -->
        <uni-popup ref="formPopup" type="bottom">
            <view class="form-content">
                <view class="form-header">
                    <text class="title">记录健康数据</text>
                    <text class="close" @click="$refs.formPopup.close()">×</text>
                </view>
                <view class="form-body">
                    <uni-forms ref="form" :model="formData" :rules="rules">
                        <uni-forms-item label="体重(kg)" name="weight">
                            <uni-easyinput type="number" v-model="formData.weight" />
                        </uni-forms-item>
                        <uni-forms-item label="体脂率(%)" name="bodyFat">
                            <uni-easyinput type="number" v-model="formData.bodyFat" />
                        </uni-forms-item>
                        <uni-forms-item label="收缩压" name="bloodPressureSystolic">
                            <uni-easyinput type="number" v-model="formData.bloodPressureSystolic" />
                        </uni-forms-item>
                        <uni-forms-item label="舒张压" name="bloodPressureDiastolic">
                            <uni-easyinput type="number" v-model="formData.bloodPressureDiastolic" />
                        </uni-forms-item>
                        <uni-forms-item label="心率" name="heartRate">
                            <uni-easyinput type="number" v-model="formData.heartRate" />
                        </uni-forms-item>
                    </uni-forms>
                </view>
                <view class="form-footer">
                    <button class="submit-btn" @click="submitForm">提交</button>
                </view>
            </view>
        </uni-popup>
    </view>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { getLatestHealthAPI, getHealthEvaluationAPI, addHealthRecordAPI } from '@/api/health'

export default {
    data() {
        return {
            latestData: {},
            evaluation: {},
            formData: {
                weight: '',
                bodyFat: '',
                bloodPressureSystolic: '',
                bloodPressureDiastolic: '',
                heartRate: ''
            },
            rules: {
                weight: {
                    rules: [{ required: true, message: '请输入体重' }]
                },
                bodyFat: {
                    rules: [{ required: true, message: '请输入体脂率' }]
                },
                bloodPressureSystolic: {
                    rules: [{ required: true, message: '请输入收缩压' }]
                },
                bloodPressureDiastolic: {
                    rules: [{ required: true, message: '请输入舒张压' }]
                },
                heartRate: {
                    rules: [{ required: true, message: '请输入心率' }]
                }
            }
        }
    },

    onShow() {
        this.loadData()
    },

    methods: {
        async loadData() {
            try {
                // 获取最新记录
                const latestRes = await getLatestHealthAPI()
                if (latestRes.code === 0) {
                    this.latestData = latestRes.data
                }

                // 获取评估结果
                const evalRes = await getHealthEvaluationAPI()
                if (evalRes.code === 0) {
                    this.evaluation = evalRes.data
                }
            } catch (error) {
                console.error('加载数据失败:', error)
            }
        },

        showRecordForm() {
            this.$refs.formPopup.open()
        },

        async submitForm() {
            try {
                // 表单验证
                await this.$refs.form.validate()
                // 提交数据
                const res = await addHealthRecordAPI(this.formData)
                if (res.code === 0) {
                    uni.showToast({
                        title: '记录成功',
                        icon: 'success'
                    })
                    this.$refs.formPopup.close()
                    this.loadData()  // 刷新数据
                }
            } catch (error) {
                console.error('提交失败:', error)
            }
        }
    },

    computed: {
        hasNormalIndexes() {
            return this.evaluation.bmiStatus === '正常' ||
                this.evaluation.bodyFatStatus === '正常' ||
                this.evaluation.bloodPressureStatus === '正常' ||
                this.evaluation.heartRateStatus === '正常'
        },
        hasAbnormalIndexes() {
            return this.evaluation.bmiStatus === '偏高' || this.evaluation.bmiStatus === '偏低' ||
                this.evaluation.bodyFatStatus === '偏高' || this.evaluation.bodyFatStatus === '偏低' ||
                this.evaluation.bloodPressureStatus === '偏高' || this.evaluation.bloodPressureStatus === '偏低' ||
                this.evaluation.heartRateStatus === '偏高' || this.evaluation.heartRateStatus === '偏低'
        }
    }
}
</script>

<style lang="scss">
.health-container {
    min-height: 100vh;
    background-color: #f5f5f5;
    padding: 0;

    .data-cards {
        padding: 20rpx;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20rpx;
        margin-bottom: 30rpx;

        .card {
            background: #fff;
            border-radius: 12rpx;
            padding: 20rpx;
            box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

            .card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20rpx;

                .title {
                    font-size: 28rpx;
                    color: #333;
                }

                .value {
                    font-size: 36rpx;
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
            }

            .card-body {
                display: flex;
                justify-content: flex-end;
                margin-bottom: 20rpx;

                .status {
                    font-size: 24rpx;
                    color: #666;
                    text-align: right;
                }
            }

            .card-footer {
                .reference {
                    font-size: 22rpx;
                    color: #999;
                    display: block;
                }
            }
        }
    }

    .advice-section {
        margin: 0;
        padding: 0;
        width: 100%;
        box-sizing: border-box;

        .advice-card {
            background: #fff;
            border-radius: 12rpx;
            padding: 20rpx;
            margin: 20rpx;
            box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
            width: calc(100% - 40rpx);
            box-sizing: border-box;

            .advice-header {
                margin-bottom: 16rpx;

                .advice-title {
                    font-size: 28rpx;
                    font-weight: bold;
                    color: #333;
                }
            }

            .encourage-content {
                margin-bottom: 20rpx;
                padding-bottom: 16rpx;
                border-bottom: 2rpx solid #f5f5f5;

                .encourage-item {
                    margin-bottom: 10rpx;

                    .normal-text {
                        font-size: 26rpx;
                        color: #07c160;
                        line-height: 1.6;
                        display: block;
                    }

                    &:last-child {
                        margin-bottom: 0;
                    }
                }
            }

            .advice-content {
                .advice-item {
                    margin-bottom: 16rpx;

                    .reason {
                        font-size: 26rpx;
                        color: #ff5151;
                        font-weight: bold;
                        display: block;
                        margin-bottom: 6rpx;
                    }

                    .advice-text {
                        font-size: 26rpx;
                        color: #666;
                        line-height: 1.6;
                        display: block;
                    }
                }

                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
    }

    .record-btn {
        width: 90%;
        height: 88rpx;
        line-height: 88rpx;
        background: #07c160;
        color: #fff;
        border-radius: 44rpx;
        margin: 40rpx auto;
        font-size: 32rpx;
    }

    .form-content {
        background: #fff;
        border-radius: 24rpx 24rpx 0 0;
        padding: 30rpx;

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
                padding: 0 20rpx;
            }
        }

        .form-body {
            max-height: 60vh;
            overflow-y: auto;
        }

        .form-footer {
            padding: 30rpx 0;

            .submit-btn {
                width: 100%;
                height: 88rpx;
                line-height: 88rpx;
                background: #07c160;
                color: #fff;
                border-radius: 44rpx;
                font-size: 32rpx;
                border: none;
            }
        }
    }
}
</style>