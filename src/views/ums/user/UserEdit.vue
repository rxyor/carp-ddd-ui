<template>
  <a-card :bordered="false">
    <a-spin :spinning="confirmLoading">
      <div class="account-center-avatarHolder">
        <a-avatar class="avatar" style="color: #000000; background-color: #5fb8fd" :size="100" :src="query.avatar">
          <b style="font-size: 30px;color: white">  {{ query.nickname }}</b>
        </a-avatar>
      </div>
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="头像URL"
          hasFeedback
        >
          <a-input
            placeholder="请输入头像图片地址"
            name="avatar"
            v-decorator="[ 'avatar', { rules: [ { validator: validateAvatar, required: true}] } ]"/>
        </a-form-item>
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
          label="昵称"
          hasFeedback
        >
          <a-input
            placeholder="请输入昵称"
            name="nickname"
            v-decorator="[ 'nickname', { rules: [ { validator: validateNickname,required: true}] } ]"/>
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
          label="禁用状态"
          hasFeedback
          validateStatus="warning"
        >
          <a-select
            v-decorator="['disable', {rules: [{ required: true, message: '请选择状态' }]}]">
            <a-select-option value="0">正常</a-select-option>
            <a-select-option value="1">禁用</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="锁定状态"
          hasFeedback
          validateStatus="warning"
        >
          <a-select
            v-decorator="['locked', {rules: [{ required: true, message: '请选择状态' }]}]">
            <a-select-option value="0">未锁定</a-select-option>
            <a-select-option value="1">锁定</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="备注"
          hasFeedback
        >
          <a-textarea
            placeholder="请输入备注"
            :autosize="textAreaSize"
            v-decorator="[ 'remark', { rules: [{validator:validateRemark} ] } ]"/>
        </a-form-item>
        <a-divider :dashed="true"/>
        <a-form-item
          :wrapperCol="{ span: 24 }"
          style="text-align: right">
          <a-button @click="goBackList" style="margin-right: 20px">返回</a-button>
          <a-button type="primary" @click="e=>updateUserById(e)">
            <span >确定</span>
          </a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-card>
</template>

<script>
import {
  VALIDATE_ERROR_MSG,
  isValidURL,
  isValidUsername,
  isValidDisplayName,
  isValidPhone,
  isValidEmail,
  isValidSimplePassword
} from '@/utils/validate'
import { getUserById, updateUser } from '@/api/user'

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
      textAreaSize: { minRows: 3, maxRows: 6 },
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
    setQueryParamsFromForm () {
      Object.assign(this.query, this.form.getFieldsValue())
    },
    async queryAndFillForm () {
      await this.queryUserById()
      this.fillDataToForm(this.record)
      Object.assign(this.query, this.record)
    },
    fillDataToForm (queryData) {
      this.$nextTick(() => {
        if (!queryData) {
          return
        }

        const data = Object.assign({}, queryData, {
          disable: queryData.disable !== undefined && queryData.disable.toString(),
          locked: queryData.locked !== undefined && queryData.locked.toString()
        })
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
    updateUserById (e) {
      this.setQueryParamsFromForm()
      e.preventDefault()

      this.form.validateFields((err, values) => {
        if (err) {
          console.error(err)
          return
        }

        updateUser(this.query).then(res => {
          const source = { success: false, msg: undefined }
          Object.assign(source, res)
          if (source.success) {
            this.$message.success('修改成功')
            this.goBackList()
          }
        })
      })
    },
    validateAvatar  (rule, value, callback) {
      if (value === null || value === undefined || value === '') {
        const msg = '请输入头像URL'
        callback(msg)
      }
      if (!isValidURL(value)) {
        callback(VALIDATE_ERROR_MSG.url)
      }
      this.query.avatar = value
      callback()
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
    validateNickname  (rule, value, callback) {
      if (value === null || value === undefined || value === '') {
        const msg = '请输入昵称'
        callback(msg)
      }
      if (!isValidDisplayName(value)) {
        callback(VALIDATE_ERROR_MSG.displayName)
      }
      this.query.nickname = value
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
    },
    validateRemark  (rule, value, callback) {
      if (value === null || value === undefined || value === '') {
        callback()
      }
      if (value.length > 255) {
        const msg = '输入超出限制, 最多255个字符'
        callback(msg)
      }
      this.query.remark = value
      callback()
    },
    goBackList () {
      this.$router.push({
        name: 'UserList'
      })
    }
  }
}
</script>

<style  lang="less" scoped>
  .account-center-avatarHolder {
    text-align: center;
    margin-bottom: 24px;

    & > .avatar {
      margin: 0 auto;
      width: 104px;
      height: 104px;
      margin-bottom: 20px;
      border-radius: 50%;
      overflow: hidden;

      img {
        height: 100%;
        width: 100%;
      }
    }
  }
</style>
