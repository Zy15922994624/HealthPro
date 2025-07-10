<script>
import { reminderUtils } from '@/utils/reminder'
import store from '@/store'

export default {
    onLaunch() {
        // 应用启动时，如果已登录则开始检查
        if (store.getters['user/isLogin']) {
            store.dispatch('settings/getSettings').then(() => {
                reminderUtils.startChecking()
            })
        }
    },

    onShow() {
        // 应用切换到前台时，如果已登录则开始检查
        if (store.getters['user/isLogin']) {
            reminderUtils.startChecking()
        }
    },

    onHide() {
        // 应用切换到后台时停止检查
        reminderUtils.stopChecking()
    }
}
</script>

<style>
</style>