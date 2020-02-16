<template>
  <a-modal
    title="编辑权限"
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
          label="权限ID"
          hasFeedback
          validateStatus="success"
        >
          <a-input placeholder="权限ID" v-decorator="['id', {rules: [{ required: true, message: '请输入ID' }]}]"name="id" disabled="disabled" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="权限编码"
          hasFeedback
        >
          <a-input
            placeholder="请输入权限编码"
            id="permissionCode"
            name="permissionCode"
            v-decorator="[ 'permissionCode', { rules: [ { required:true, validator: validatePermissionCode, }] } ]"
            disabled="disabled" />
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
import { updatePermission } from '@/api/permission'
import pick from 'lodash.pick'

export default {
  name: 'EditPermissionModal',
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
        id: undefined,
        permissionName: undefined,
        permissionCode: undefined,
        permissionDesc: undefined,
        status: undefined,
        disable: undefined
      }
    }
  },
  mounted () {
    this.fillValuesToEditForm(this.permission)
  },
  methods: {
    showForm (data) {
      this.$nextTick(() => {
        this.permission = Object.assign({}, data)
        this.fillValuesToEditForm(this.permission)
      })
      this.visible = true
    },
    fillValuesToEditForm (data) {
      const { form } = this
      if (data.disable) {
        data.status = data.disable.toString()
      }
      const formData = pick(data, ['id', 'permissionName', 'permissionCode', 'permissionDesc', 'status'])
      setTimeout(() => {
        form.setFieldsValue(formData)
      }, 0)
    },
    setFormValuesToPermission () {
      this.permission = Object.assign(this.permission, this.form.getFieldsValue())
      this.permission.disable = parseInt(this.permission.status)
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
          updatePermission(this.permission).then(res => {
            if (res && res.success) {
              this.$message.info('修改权限信息成功')
              this.visible = false
              this.$emit('ok', this.permission)
            } else {
              this.$message.error('修改权限信息失败')
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
