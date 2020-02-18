<template>
  <a-card :bordered="false">
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
            v-decorator="[ 'roleCode', { rules: [ { validator: validateRoleCode, required: true}] } ]"/>
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
            v-decorator="[ 'roleName', { rules: [ { validator: validateRoleName, required: true}] } ]"/>
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
          <a-button type="primary" @click="e=>saveRole(e)">
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
  isValidRoleCode,
  isValidShortChineseName
} from '@/utils/validate'
import { saveRole } from '@/api/role'

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
    saveRole (e) {
      this.setQueryParamsFromForm()
      e.preventDefault()

      this.form.validateFields((err, values) => {
        if (err) {
          console.error(err)
          return
        }

        saveRole(this.query).then(res => {
          const source = { success: false, msg: undefined }
          Object.assign(source, res)
          if (source.success) {
            this.$message.success('添加成功')
            this.goBackList()
          }
        })
      })
    },
    validateRoleCode  (rule, value, callback) {
      if (value === null || value === undefined || value === '') {
        const msg = '请输入角色编码'
        callback(msg)
      }
      if (!isValidRoleCode(value)) {
        callback(VALIDATE_ERROR_MSG.roleCode)
      }
      this.query.roleCode = value
      callback()
    },
    validateRoleName  (rule, value, callback) {
      if (value === null || value === undefined || value === '') {
        const msg = '请输入角色名称'
        callback(msg)
      }
      if (!isValidShortChineseName(value)) {
        callback(VALIDATE_ERROR_MSG.shortChineseName)
      }
      this.query.roleName = value
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
        name: 'RoleList'
      })
    }
  }
}
</script>

<style  lang="less" scoped>
</style>
