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
          label="权限编码"
          hasFeedback
        >
          <a-input
            placeholder="请输入权限编码"
            name="permissionCode"
            v-decorator="[ 'permissionCode', { rules: [ { validator: validatePermissionCode, required: true}] } ]"
            disabled="disabled" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="权限名称"
          hasFeedback>
          <a-input
            placeholder="请输入权限名称"
            name="permissionName"
            v-decorator="[ 'permissionName', { rules: [ { validator: validatePermissionName, required: true}] } ]"/>
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
          <a-button type="primary" @click="e=>updatePermissionById(e)">
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
  isValidPermissionCode,
  isValidShortChineseName
} from '@/utils/validate'
import { updatePermission, getPermissionById } from '@/api/permission'

export default {
  name: 'PermissionEdit',
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
      await this.queryPermissionById()
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
    async queryPermissionById () {
      this.confirmLoading = true
      await getPermissionById({ id: this.query.id }).then(res => {
        const source = { success: false, msg: undefined, data: {} }
        Object.assign(source, res)
        Object.assign(this.record, source.data)
        this.confirmLoading = false
      })
    },
    updatePermissionById (e) {
      this.setQueryParamsFromForm()
      e.preventDefault()

      this.form.validateFields((err, values) => {
        if (err) {
          console.error(err)
          return
        }
        updatePermission(this.query).then(res => {
          const source = { success: false, msg: undefined }
          Object.assign(source, res)
          if (source.success) {
            this.$message.success('修改成功')
            this.goBackList()
          }
        })
      })
    },
    validatePermissionCode  (rule, value, callback) {
      if (value === null || value === undefined || value === '') {
        callback()
      }
      if (!isValidPermissionCode(value)) {
        callback(VALIDATE_ERROR_MSG.permissionCode)
      }
      this.query.permissionCode = value
      callback()
    },
    validatePermissionName  (rule, value, callback) {
      if (value === null || value === undefined || value === '') {
        const msg = '请输入权限名称'
        callback(msg)
      }
      if (!isValidShortChineseName(value)) {
        callback(VALIDATE_ERROR_MSG.shortChineseName)
      }
      this.query.permissionName = value
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
        name: 'PermissionList'
      })
    }
  }
}
</script>

<style  lang="less" scoped>
</style>
