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
            v-decorator="[ 'username', { rules: [ { validator: validateUsername, required: true}] } ]"/>
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
            v-decorator="[ 'phone', { rules: [ { validator: validatePhone, required: true}] } ]"/>
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
            v-decorator="[ 'email', { rules: [ { validator: validateEmail, required: true}] } ]"/>
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
            v-decorator="[ 'password', { rules: [ { validator: validatePassword, required: true}] } ]"/>
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
            v-decorator="[ 'confirmPassword', { rules: [ { validator: validateConfirmPassword, required: true}] } ]"/>
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
          <a-button type="primary" @click="e=>saveUser(e)">
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
import { saveUser } from '@/api/user'

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
        username: undefined,
        phone: undefined,
        nickname: undefined,
        email: undefined,
        password: undefined,
        remark: undefined
      },
      record: {}
    }
  },
  mounted () {
  },
  methods: {
    setQueryParamsFromForm () {
      Object.assign(this.query, this.form.getFieldsValue())
    },
    saveUser (e) {
      this.setQueryParamsFromForm()
      e.preventDefault()

      this.form.validateFields((err, values) => {
        if (err) {
          console.error(err)
          return
        }

        saveUser(this.query).then(res => {
          const source = { success: false, msg: undefined }
          Object.assign(source, res)
          if (source.success) {
            this.$message.success('添加成功')
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
        const msg = '请输入用户名'
        callback(msg)
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
        const msg = '请输入手机号'
        callback(msg)
      }
      if (!isValidPhone(value)) {
        callback(VALIDATE_ERROR_MSG.phone)
      }
      this.query.phone = value
      callback()
    },
    validateEmail  (rule, value, callback) {
      if (value === null || value === undefined || value === '') {
        const msg = '请输入邮箱'
        callback(msg)
      }
      if (!isValidEmail(value)) {
        callback(VALIDATE_ERROR_MSG.email)
      }
      this.query.email = value
      callback()
    },
    validatePassword  (rule, value, callback) {
      if (value === null || value === undefined || value === '') {
        const msg = '请输入头像URL'
        callback(msg)
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
