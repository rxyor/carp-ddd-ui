<template>
  <a-card :bordered="false">
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
            v-decorator="[ 'username', { rules: [ { validator: validateUsername, }] } ]"
            disabled="disabled" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="手机"
          hasFeedback
        >
          <a-input
            placeholder="请输入手机号"
            name="phone"
            v-decorator="[ 'phone', { rules: [ { validator: validatePhone, }] } ]"
            disabled="disabled" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="邮箱"
          hasFeedback
        >
          <a-input
            placeholder="请输入邮箱"
            name="email"
            v-decorator="[ 'email', { rules: [ { validator: validateEmail, }] } ]"
            disabled="disabled" />
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
            v-decorator="[ 'password', { rules: [ { validator: validatePassword, }] } ]"/>
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
            v-decorator="[ 'confirmPassword', { rules: [ { validator: validateConfirmPassword, }] } ]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="状态"
          hasFeedback
          validateStatus="warning"
        >
          <a-select
            v-decorator="['status', {rules: [{ required: true, message: '请选择状态' }], initialValue: '0'}]">
            <a-select-option value="0">正常</a-select-option>
            <a-select-option value="1">禁用</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-card>
</template>

<script>
import {
  VALIDATE_ERROR_MSG,
  isValidUsername,
  isValidPhone,
  isValidEmail,
  isValidSimplePassword
} from '@/utils/validate'
import { getUserById } from '@/api/user'

export default {
  name: 'UserEdit',
  data () {
    return {
      labelCol: {
        xs: { span: 14 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      form: this.$form.createForm(this),
      confirmLoading: false,

      routerParams: {
        id: undefined
      },
      query: {
        id: undefined
      },
      record: {}
    }
  },
  mounted () {
    this.initParamsFromRouter()
    this.queryAndFillForm()
  },
  methods: {
    initParamsFromRouter () {
      Object.assign(this.routerParams, this.$route.query)
      Object.assign(this.query, this.routerParams)
    },
    async queryAndFillForm () {
      await this.queryUserById()
      this.fillDataToForm(this.record)
    },
    fillDataToForm (queryData) {
      this.$nextTick(() => {
        if (!queryData) {
          return
        }

        const data = Object.assign({}, queryData)
        setTimeout(() => {
          this.form.setFieldsValue(data)
        })
      })
    },
    async queryUserById () {
      this.confirmLoading = true
      await getUserById({ id: this.query.id }).then(res => {
        const source = { success: false, msg: undefined, data: {} }
        Object.assign(source, res)
        Object.assign(this.record, source.data)
        this.confirmLoading = false
      })
    },
    validateUsername  (rule, value, callback) {
      if (value === null || value === undefined || value === '') {
        callback()
      }
      if (!isValidUsername(value)) {
        callback(VALIDATE_ERROR_MSG.username)
      }
      this.query.username = value
      callback()
    },
    validatePhone  (rule, value, callback) {
      if (value === null || value === undefined || value === '') {
        callback()
      }
      if (!isValidPhone(value)) {
        callback(VALIDATE_ERROR_MSG.phone)
      }
      this.query.phone = value
      callback()
    },
    validateEmail  (rule, value, callback) {
      if (value === null || value === undefined || value === '') {
        callback()
      }
      if (!isValidEmail(value)) {
        callback(VALIDATE_ERROR_MSG.email)
      }
      this.query.email = value
      callback()
    },
    validatePassword  (rule, value, callback) {
      if (value === null || value === undefined || value === '') {
        callback()
      }
      if (!isValidSimplePassword(value)) {
        callback(VALIDATE_ERROR_MSG.simplePassword)
      }
      this.query.password = value
      callback()
    },
    validateConfirmPassword  (rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('password')) {
        callback(VALIDATE_ERROR_MSG.confirmPassword)
      }
      callback()
    }
  }
}
</script>

<style scoped>

</style>
