<template>
	<view class="password-container">
		<uni-forms ref="form" :model="formData" :rules="rules">
			<uni-forms-item label="原密码" name="oldPassword">
				<uni-easyinput type="password" v-model="formData.oldPassword" placeholder="请输入原密码"></uni-easyinput>
			</uni-forms-item>
			
			<uni-forms-item label="新密码" name="newPassword">
				<uni-easyinput type="password" v-model="formData.newPassword" placeholder="请输入新密码"></uni-easyinput>
			</uni-forms-item>
			
			<uni-forms-item label="确认密码" name="rePassword">
				<uni-easyinput type="password" v-model="formData.rePassword" placeholder="请确认新密码"></uni-easyinput>
			</uni-forms-item>
		</uni-forms>
		
		<button class="save-btn" @click="handleSave">确认修改</button>
	</view>
</template>

<script>
import { updatePasswordAPI } from '@/api/user.js'

export default {
	data() {
		return {
			formData: {
				oldPassword: '',
				newPassword: '',
				rePassword: ''
			},
			rules: {
				oldPassword: {
					rules: [{
						required: true,
						errorMessage: '请输入原密码'
					}]
				},
				newPassword: {
					rules: [{
						required: true,
						errorMessage: '请输入新密码'
					}, {
						minLength: 6,
						errorMessage: '密码长度不能少于6位'
					}]
				},
				rePassword: {
					rules: [{
						required: true,
						errorMessage: '请确认新密码'
					}, {
						validateFunction: (rule, value, data) => {
							return value === data.newPassword
						},
						errorMessage: '两次密码输入不一致'
					}]
				}
			}
		}
	},
	methods: {
		async handleSave() {
			try {
				// 表单验证
				await this.$refs.form.validate()
				
				// 发送修改密码请求
				await updatePasswordAPI({
					oldPassword: this.formData.oldPassword,
					newPassword: this.formData.newPassword,
					rePassword: this.formData.rePassword
				})
				
				uni.showToast({
					title: '密码修改成功',
					icon: 'success'
				})
				
				// 返回上一页
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)
				
			} catch (error) {
				// 表单验证失败或请求失败的错误处理已在相应位置完成
			}
		}
	}
}
</script>

<style lang="scss">
.password-container {
	padding: 30rpx;
	
	.save-btn {
		margin-top: 60rpx;
		background: #1aa7e3;
		color: #fff;
	}
}
</style> 