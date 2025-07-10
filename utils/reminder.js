import store from '@/store'

// 提醒工具类
export const reminderUtils = {
    // 模板ID常量
    TEMPLATE_IDS: {
        GOAL_REMINDER: 'W4_lajK--Gg10QEqoCaA7QFyCxcbHVw5s0jkzzAKqL4', // 健身计划提醒
    },

    // 添加定时器ID
    checkTimer: null,

    // 启动定时检查
    startChecking() {
        console.log('开始启动提醒检查...')
        // 先清除可能存在的定时器
        if (this.checkTimer) {
            console.log('清除已存在的定时器')
            clearInterval(this.checkTimer)
            this.checkTimer = null
        }

        // 检查登录状态
        const token = store.state.user.token
        console.log('当前token状态:', token ? '已登录' : '未登录')
        if (!token) {
            console.log('未登录，不启动检查')
            return
        }

        // 从store中获取用户设置
        const userSettings = store.state.settings.settings
        console.log('从store获取的用户设置:', userSettings)
        
        if (!userSettings?.enableReminder) {
            console.log('提醒未开启，不启动检查')
            return
        }

        // 检查是否已有下次提醒时间
        let nextReminderTime = uni.getStorageSync('nextReminderTime')
        
        // 只有在没有下次提醒时间的情况下才设置
        if (!nextReminderTime) {
            const reminderTime = userSettings.reminderTime
            if (reminderTime) {
                const [hours, minutes] = reminderTime.split(':').map(Number)
                const next = new Date()
                next.setHours(hours, minutes, 0, 0)
                
                // 如果今天的提醒时间已过，设置为明天
                if (next.getTime() <= Date.now()) {
                    next.setDate(next.getDate() + 1)
                }
                
                console.log('设置下一次提醒时间:', next.toLocaleString())
                nextReminderTime = next.getTime()
                uni.setStorageSync('nextReminderTime', nextReminderTime)
            }
        } else {
            console.log('使用已存在的下次提醒时间:', new Date(nextReminderTime).toLocaleString())
        }

        // 启动定时检查 - 每分钟检查一次
        this.checkTimer = setInterval(() => {
            console.log('执行定时检查...')
            this.checkReminder()
        }, 60000) // 改为1分钟检查一次
        
        // 立即检查一次
        console.log('执行立即检查')
        this.checkReminder()
    },

    // 停止检查
    stopChecking() {
        console.log('停止提醒检查')
        if (this.checkTimer) {
            clearInterval(this.checkTimer)
            this.checkTimer = null
        }
        // 不要清除提醒设置，只清除定时器
    },

    // 设置提醒
    async setReminder(time, data) {
        try {
            console.log('设置新的提醒时间:', time)
            const tmplData = {
                thing1: { value: `目标:${data.targetWeight}kg/${data.targetBMI}BMI` },
                thing2: { value: `${data.targetSteps}步/天` },
                thing3: { value: `运动${data.targetDuration}分钟/天` }
            }

            // 设置定时提醒
            const [hours, minutes] = time.split(':').map(Number)
            const now = new Date()
            const reminderTime = new Date()
            reminderTime.setHours(hours, minutes, 0, 0)

            // 如果当前时间已过今天的提醒时间，设置为明天
            if (now.getTime() > reminderTime.getTime()) {
                reminderTime.setDate(reminderTime.getDate() + 1)
            }
            
            console.log('计算得到的下次提醒时间:', reminderTime.toLocaleString())

            // 保存提醒相关数据
            uni.setStorageSync('nextReminderTime', reminderTime.getTime())
            uni.setStorageSync('reminderTime', time)
            uni.setStorageSync('reminderData', tmplData)
            
            // 清除上次提醒记录
            uni.removeStorageSync('lastRemindDate')
            
            // 重启定时检查
            this.startChecking()

            return true
        } catch (error) {
            console.error('设置提醒失败:', error)
            return false
        }
    },
    
    // 取消提醒
    cancelReminder() {
        console.log('取消所有提醒设置')
        uni.removeStorageSync('nextReminderTime')
        uni.removeStorageSync('reminderTime')
        uni.removeStorageSync('reminderData')
        uni.removeStorageSync('lastRemindDate')
    },
    
    // 检查是否需要提醒
    async checkReminder() {
        try {
            // 先检查登录状态
            const token = store.state.user.token
            if (!token) {
                console.log('用户未登录，停止检查')
                this.stopChecking()
                return
            }

            // 再检查用户设置
            const userSettings = store.state.settings.settings
            if (!userSettings?.enableReminder) {
                console.log('提醒未开启')
                return
            }

            const nextReminderTime = uni.getStorageSync('nextReminderTime')
            if (!nextReminderTime) {
                console.log('未设置下次提醒时间')
                return
            }

            const now = Date.now()
            console.log('当前时间:', new Date(now).toLocaleString())
            console.log('下次提醒时间:', new Date(nextReminderTime).toLocaleString())
            
            // 获取上次提醒的日期
            const lastRemindDate = uni.getStorageSync('lastRemindDate')
            const today = new Date().toDateString()
            
            // 如果今天已经提醒过了，就不再提醒
            if (lastRemindDate === today) {
                console.log('今天已经提醒过了，跳过提醒')
                return
            }

            // 检查是否到达提醒时间
            if (now >= nextReminderTime) {
                console.log('到达提醒时间，准备发送提醒')
                const reminderData = uni.getStorageSync('reminderData')
                
                if (reminderData) {
                    // 发送提醒
                    await uni.showModal({
                        title: '健康目标提醒',
                        content: `${reminderData.thing1.value}\n${reminderData.thing2.value}\n${reminderData.thing3.value}`,
                        showCancel: false
                    })
                    console.log('提醒发送完成')
                    
                    // 记录今天已经提醒过
                    uni.setStorageSync('lastRemindDate', today)

                    // 设置下一次提醒
                    const time = uni.getStorageSync('reminderTime')
                    if (time) {
                        const [hours, minutes] = time.split(':').map(Number)
                        const next = new Date()
                        next.setHours(hours, minutes, 0, 0)
                        next.setDate(next.getDate() + 1)  // 设置为明天
                        console.log('设置下一次提醒时间:', next.toLocaleString())
                        uni.setStorageSync('nextReminderTime', next.getTime())
                    }
                }
            } else {
                console.log('未到提醒时间，继续等待')
            }
        } catch (error) {
            console.error('检查提醒失败:', error)
        }
    },

    // 发送提醒
    async sendReminder() {
        const goals = uni.getStorageSync('reminderGoals')
        if (!goals) return

        uni.showNotification({
            title: '健康目标提醒',
            content: goals.content,
            data: {
                sportName: goals.sportName,
                tips: goals.tips
            }
        })
    }
} 