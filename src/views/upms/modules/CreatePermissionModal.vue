<template>
  <a-modal
    title="新建权限"
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
          label="权限编码"
          hasFeedback
        >
          <a-input
            placeholder="请输入权限编码"
            name="permissionCode"
            v-decorator="[ 'permissionCode', { rules: [ { required:true, validator: validatePermissionCode, }] } ]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="权限名称"
          hasFeedback
        >
          <a-input
            placeholder="请输入权限名称"
            name="permissionName"
            v-decorator="[ 'permissionName', { rules: [ { required: true, min:2,max:50,message: '请输入2-50个字符', }] } ]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="权限描述"
          hasFeedback
        >
          <a-textarea
            placeholder="请输入描述"
            name="permissionDesc"
            v-decorator="[ 'permissionDesc', { rules: [ { required: true, min:5,max:100,message: '请输入5-100个字符', }] } ]"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

import { VALIDATE_ERROR_MSG, isValidPermissionCode } from '@/utils/validate'
import { savePermission } from '@/api/permission'

export default {
  name: 'CreatePermissionModal',
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

      permission: {
        permissionCode: '',
        permissionName: '',
        permissionDesc: ''
      }
    }
  },
  methods: {
    showForm () {
      this.visible = true
    },
    setFormValuesToPermission () {
      this.permission = Object.assign(this.permission, this.form.getFieldsValue())
    },
    validatePermissionCode  (rule, value, callback) {
      if (!isValidPermissionCode(value)) {
        callback(VALIDATE_ERROR_MSG.permissionCode)
      }
      this.permission.permissionCode = value
      callback()
    },
    handleSubmit () {
      this.confirmLoading = true
      this.form.validateFields((errors, values) => {
        if (!errors) {
          this.setFormValuesToPermission()
          savePermission(this.permission).then(res => {
            if (res && res.success) {
              this.$message.info('保存权限信息成功')
              this.visible = false
              this.$emit('ok', this.permission)
            } else {
              this.$message.error('保存权限信息失败:', res.msg)
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
