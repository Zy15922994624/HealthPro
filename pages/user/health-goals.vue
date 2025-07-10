<template>
    <view class="goals-container">
        <!-- 健康目标设置 -->
        <view class="settings-group">
            <view class="group-title">健康目标</view>
            <view class="settings-item">
                <text class="label">目标体重(kg)</text>
                <input type="digit" v-model="settings.targetWeight" placeholder="请输入目标体重" />
            </view>
            <view class="settings-item">
                <text class="label">目标BMI</text>
                <input type="digit" v-model="settings.targetBMI" placeholder="请输入目标BMI" />
            </view>
        </view>

        <!-- 运动目标 -->
        <view class="settings-group">
            <view class="group-title">运动目标</view>
            <view class="settings-item">
                <text class="label">每日步数</text>
                <input type="number" v-model="settings.targetSteps" placeholder="请输入目标步数" />
            </view>
            <view class="settings-item">
                <text class="label">运动时长(分钟)</text>
                <input type="number" v-model="settings.targetDuration" placeholder="请输入目标时长" />
            </view>
        </view>

        <!-- 记录提醒 -->
        <view class="settings-group">
            <view class="group-title">记录提醒</view>
            <view class="settings-item">
                <text class="label">健康记录提醒</text>
                <button class="reminder-btn" :class="{ active: settings.enableReminder }" @tap="handleReminderTap">
                    {{ settings.enableReminder ? '已开启' : '未开启' }}
                </button>
            </view>
            <view class="settings-item" v-if="settings.enableReminder">
                <text class="label">提醒时间</text>
                <picker mode="time" :value="settings.reminderTime" @change="onTimeChange">
                    <text>{{ settings.reminderTime || '请选择时间' }}</text>
                </picker>
            </view>
        </view>

        <!-- 保存按钮 -->
        <button class="save-btn" @click="saveSettings">保存设置</button>
    </view>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { reminderUtils } from '@/utils/reminder'

export default {
    data() {
        return {
            isSaving: false
        }
    },
    computed: {
        ...mapState('settings', ['settings'])
    },
    created() {
        this.loadSettings()
    },
    methods: {
        ...mapActions('settings', {
            updateSettings: 'saveSettings',
            getSettings: 'getSettings'
        }),

        showInfo(type) {
            const tips = {
                weight: '建议BMI在18.5-24.9之间',
                bmi: '健康BMI范围：18.5-24.9'
            }
            uni.showToast({
                title: tips[type],
                icon: 'none',
                duration: 2000
            })
        },

        async loadSettings() {
            uni.showLoading({ title: '加载中...' })
            try {
                await this.getSettings()
            } finally {
                uni.hideLoading()
            }
        },

        async handleReminderTap() {
            try {
                if (!this.settings.enableReminder) {
                    // 请求订阅消息权限
                    const res = await uni.requestSubscribeMessage({
                        tmplIds: [reminderUtils.TEMPLATE_IDS.GOAL_REMINDER]
                    })
                    console.log('订阅消息权限结果:', res)

                    if (res[reminderUtils.TEMPLATE_IDS.GOAL_REMINDER] === 'accept') {
                        // 用户同意订阅，开启提醒
                        this.settings.enableReminder = true
                        await this.saveReminderSettings()
                    } else {
                        uni.showToast({
                            title: '需要开启订阅才能使用提醒功能',
                            icon: 'none'
                        })
                    }
                } else {
                    // 关闭提醒
                    this.settings.enableReminder = false
                    reminderUtils.cancelReminder()
                    await this.saveReminderSettings()
                }
            } catch (error) {
                console.error('设置提醒失败:', error)
                this.settings.enableReminder = false
                uni.showToast({
                    title: '设置失败',
                    icon: 'none'
                })
            }
        },

        async saveReminderSettings() {
            const settingsData = {
                id: this.settings.id,
                userId: this.settings.userId,
                enableReminder: this.settings.enableReminder,
                reminderTime: this.settings.reminderTime || '08:00',
                targetWeight: Number(this.settings.targetWeight) || null,
                targetBMI: Number(this.settings.targetBMI) || null,
                targetSteps: Number(this.settings.targetSteps) || null,
                targetDuration: Number(this.settings.targetDuration) || null
            }

            const saveResult = await this.updateSettings(settingsData)

            if (saveResult && this.settings.enableReminder) {
                const reminderSuccess = await reminderUtils.setReminder(
                    settingsData.reminderTime,
                    {
                        targetWeight: settingsData.targetWeight,
                        targetBMI: settingsData.targetBMI,
                        targetSteps: settingsData.targetSteps,
                        targetDuration: settingsData.targetDuration
                    }
                )

                if (!reminderSuccess) {
                    this.settings.enableReminder = false
                    await this.updateSettings(this.settings)
                    uni.showToast({
                        title: '设置提醒失败',
                        icon: 'none'
                    })
                }
            }
        },

        async onTimeChange(e) {
            try {
                console.log('修改提醒时间:', e.detail.value)
                // 先更新本地数据
                this.settings.reminderTime = e.detail.value

                // 保存设置到数据库
                await this.updateSettings(this.settings)

                if (this.settings.enableReminder) {
                    const reminderData = {
                        targetWeight: Number(this.settings.targetWeight) || 0,
                        targetBMI: Number(this.settings.targetBMI) || 0,
                        targetSteps: Number(this.settings.targetSteps) || 10000,
                        targetDuration: Number(this.settings.targetDuration) || 30
                    }

                    // 设置新的提醒
                    const success = await reminderUtils.setReminder(
                        e.detail.value,
                        reminderData
                    )
                    console.log('重新设置提醒结果:', success)

                    if (!success) {
                        uni.showToast({
                            title: '更新提醒时间失败',
                            icon: 'none'
                        })
                    }
                }
            } catch (error) {
                console.error('更新时间失败:', error)
                uni.showToast({
                    title: '设置失败',
                    icon: 'none'
                })
            }
        },

        validateSettings() {
            const { targetWeight, targetBMI, targetSteps, targetDuration } = this.settings

            if (targetWeight && (targetWeight < 20 || targetWeight > 200)) {
                uni.showToast({
                    title: '请输入合理的目标体重',
                    icon: 'none'
                })
                return false
            }

            if (targetBMI && (targetBMI < 16 || targetBMI > 35)) {
                uni.showToast({
                    title: '请输入合理的目标BMI',
                    icon: 'none'
                })
                return false
            }

            if (targetSteps && (targetSteps < 1000 || targetSteps > 50000)) {
                uni.showToast({
                    title: '请输入合理的目标步数',
                    icon: 'none'
                })
                return false
            }

            if (targetDuration && (targetDuration < 10 || targetDuration > 300)) {
                uni.showToast({
                    title: '请输入合理的运动时长',
                    icon: 'none'
                })
                return false
            }

            return true
        },

        async saveSettings() {
            if (this.isSaving) return
            if (!this.validateSettings()) return

            this.isSaving = true
            try {
                uni.showLoading({ title: '保存中...' })

                const settingsData = {
                    id: this.settings.id,
                    userId: this.settings.userId,
                    targetWeight: Number(this.settings.targetWeight) || null,
                    targetBMI: Number(this.settings.targetBMI) || null,
                    targetSteps: Number(this.settings.targetSteps) || null,
                    targetDuration: Number(this.settings.targetDuration) || null,
                    enableReminder: this.settings.enableReminder,
                    reminderTime: this.settings.reminderTime
                }
                console.log('准备保存的数据:', settingsData)

                const success = await this.updateSettings(settingsData)
                console.log('保存结果:', success)

                if (success === true) {
                    uni.showToast({
                        title: '保存成功',
                        icon: 'success'
                    })
                } else {
                    throw new Error('保存失败')
                }
            } catch (error) {
                console.error('保存错误:', error)
                uni.showModal({
                    title: '保存失败',
                    content: '请检查网络后重试',
                    showCancel: false
                })
            } finally {
                uni.hideLoading()
                this.isSaving = false
            }
        }
    }
}
</script>

<style lang="scss">
.goals-container {
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

            .label-wrap {
                display: flex;
                align-items: center;
                gap: 10rpx;

                .label {
                    font-size: 28rpx;
                    color: #333;
                }
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

    .reminder-btn {
        margin: 0;
        padding: 0 20rpx;
        height: 60rpx;
        line-height: 60rpx;
        font-size: 28rpx;
        color: #666;
        background: #f5f5f5;
        border: 1rpx solid #ddd;
        border-radius: 30rpx;

        &.active {
            color: #fff;
            background: #07c160;
            border-color: #07c160;
        }

        &::after {
            border: none;
        }
    }

    .save-btn {
        margin-top: 40rpx;
        background: #07c160;
        color: #fff;
        border-radius: 12rpx;

        &[loading] {
            opacity: 0.7;
        }
    }
}
</style>