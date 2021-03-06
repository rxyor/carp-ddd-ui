<template>
  <a-card :bordered="false">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="id"
          hasFeedback
        >
          <a-input
            placeholder="请输入id"
            name="id"
            v-decorator="[ 'id', { rules: [ { required: true}] } ]"
            disabled="disabled" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色编码"
          hasFeedback
        >
          <a-input
            placeholder="请输入角色编码"
            name="roleCode"
            v-decorator="[ 'roleCode', { rules: [ { validator: validateRoleCode, required: true}] } ]"
            disabled="disabled" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色名称"
          hasFeedback>
          <a-input
            placeholder="请输入角色名称"
            name="roleName"
            v-decorator="[ 'roleName', { rules: [ { validator: validateRoleName, required: true}] } ]"/>
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
          <a-button type="primary" @click="e=>updateRoleById(e)">
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
import { updateRole, getRoleById } from '@/api/role'

export default {
  name: 'RoleEdit',
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
      await this.queryRoleById()
      this.fillDataToForm(this.record)
      Object.assign(this.query, this.record)
    },
    fillDataToForm (queryData) {
      this.$nextTick(() => {
        if (!queryData) {
          return
        }

        const data = Object.assign({}, queryData, {
          disable: queryData.disable !== undefined && queryData.disable.toString()
        })
        setTimeout(() => {
          this.form.setFieldsValue(data)
        })
      })
    },
    async queryRoleById () {
      this.confirmLoading = true
      await getRoleById({ id: this.query.id }).then(res => {
        const source = { success: false, msg: undefined, data: {} }
        Object.assign(source, res)
        Object.assign(this.record, source.data)
        this.confirmLoading = false
      })
    },
    updateRoleById (e) {
      this.setQueryParamsFromForm()
      e.preventDefault()

      this.form.validateFields((err, values) => {
        if (err) {
          console.error(err)
          return
        }
        updateRole(this.query).then(res => {
          const source = { success: false, msg: undefined }
          Object.assign(source, res)
          if (source.success) {
            this.$message.success('修改成功')
            this.goBackList()
          }
        })
      })
    },
    validateRoleCode  (rule, value, callback) {
      if (value === null || value === undefined || value === '') {
        callback()
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
