<template>
  <a-modal
    title="新建角色"
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
          label="角色编码"
          hasFeedback
        >
          <a-input
            placeholder="请输入角色编码"
            name="roleCode"
            v-decorator="[ 'roleCode', { rules: [ { required:true, validator: validateRoleCode, }] } ]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色名称"
          hasFeedback
        >
          <a-input
            placeholder="请输入角色名称"
            name="roleName"
            v-decorator="[ 'roleName', { rules: [ { required: true, min:2,max:50,message: '请输入2-50个字符', }] } ]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色描述"
          hasFeedback
        >
          <a-textarea
            placeholder="请输入描述"
            name="roleDesc"
            v-decorator="[ 'roleDesc', { rules: [ { required: true, min:5,max:100,message: '请输入5-100个字符', }] } ]"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

import { VALIDATE_ERROR_MSG, isValidRoleCode } from '@/utils/validate'
import { saveRole } from '@/api/role'

export default {
  name: 'CreateRoleModal',
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

      role: {
        roleCode: '',
        roleName: '',
        roleDesc: ''
      }
    }
  },
  methods: {
    showForm () {
      this.visible = true
    },
    setFormValuesToRole () {
      this.role = Object.assign(this.role, this.form.getFieldsValue())
    },
    validateRoleCode  (rule, value, callback) {
      if (!isValidRoleCode(value)) {
        callback(VALIDATE_ERROR_MSG.roleCode)
      }
      this.role.roleCode = value
      callback()
    },
    handleSubmit () {
      this.confirmLoading = true
      this.form.validateFields((errors, values) => {
        if (!errors) {
          this.setFormValuesToRole()
          saveRole(this.role).then(res => {
            if (res && res.success) {
              this.$message.info('保存角色信息成功')
              this.visible = false
              this.$emit('ok', this.role)
            } else {
              this.$message.error('保存角色信息失败:', res.msg)
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
