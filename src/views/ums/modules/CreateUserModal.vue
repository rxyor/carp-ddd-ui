<template>
  <a-modal
    title="新建用户"
    :width="640"
    :visible="visible"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="用户名"
          hasFeedback
        >
          <a-input
            placeholder="请输入用户名"
            name="username"
            v-decorator="[ 'username', { rules: [ { required:true, validator: validateUsername, }] } ]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="密码"
          hasFeedback
        >
          <a-input
            placeholder="请输入密码"
            name="password"
            type="password"
            v-decorator="[ 'password', { rules: [ { required:true, validator: validatePassword, }] } ]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="确认密码"
          hasFeedback
        >
          <a-input
            placeholder="请再次输入密码"
            name="confirmPassword"
            type="password"
            v-decorator="[ 'confirmPassword', { rules: [ { required:true, validator: validateConfirmPassword, }] } ]"/>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

import { VALIDATE_ERROR_MSG, isValidUsername, isValidSimplePassword } from '@/utils/validate'
import { saveUser } from '@/api/user'

export default {
  name: 'CreateUserModal',
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      visible: false,
      confirmLoading: false,

      form: this.$form.createForm(this),

      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    showForm () {
      this.visible = true
    },
    setFormValuesToUser () {
      this.user = Object.assign(this.user, this.form.getFieldsValue())
    },
    validateUsername  (rule, value, callback) {
      if (!isValidUsername(value)) {
        callback(VALIDATE_ERROR_MSG.username)
      }
      this.user.username = value
      callback()
    },
    validatePassword  (rule, value, callback) {
      if (!isValidSimplePassword(value)) {
        callback(VALIDATE_ERROR_MSG.simplePassword)
      }
      this.user.password = value
      callback()
    },
    validateConfirmPassword  (rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('password')) {
        callback(VALIDATE_ERROR_MSG.confirmPassword)
      }
      callback()
    },
    handleSubmit () {
      this.confirmLoading = true
      this.form.validateFields((errors, values) => {
        if (!errors) {
          this.setFormValuesToUser()
          saveUser(this.user).then(res => {
            if (res && res.success) {
              this.$message.info('保存用户信息成功')
              this.visible = false
              this.$emit('ok', this.role)
            } else {
              this.$message.error('保存用户信息失败:', res.msg)
            }
          })
        }
        this.confirmLoading = false
      })
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>
