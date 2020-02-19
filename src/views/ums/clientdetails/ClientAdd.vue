<template>
  <a-card :bordered="false">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="客户端ID"
          hasFeedback
        >
          <a-input
            placeholder="请输入"
            name="clientId"
            v-decorator="[ 'clientId', { rules: [ { required:true, validator: validateClientId, }] } ]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="客户端密码"
          hasFeedback
        >
          <a-input
            placeholder="请输入"
            name="clientSecret"
            v-decorator="[ 'clientSecret', { rules: [ { required:true, validator: validateSecret, }] } ]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="授权方式"
          hasFeedback
        >
          <a-select
            showSearch
            mode="multiple"
            placeholder="请选择"
            name="authorizedGrantTypeList"
            v-decorator="[ 'authorizedGrantTypeList', { rules: [ { required:true,message:'请至少选择一项' }] } ]">
            <a-select-option v-for="(item, index) in grantTypeKvConfigList" :key="index" :value="item.value">{{ item.desc }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-divider :dashed="true"/>
        <a-form-item
          :wrapperCol="{ span: 24 }"
          style="text-align: right">
          <a-button @click="goBackList" style="margin-right: 20px">返回</a-button>
          <a-button type="primary" @click="e=>saveClient(e)">
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
  isValidSimpleCode,
  isValidClientSecret
} from '@/utils/validate'
import { saveClient } from '@/api/client'
import { findByKeyAndAppId } from '@/api/kv-config'
import { appIdOptions, authorityOptions } from '@/api/option'

export default {
  name: 'ClientAdd',
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

      grantTypeKvConfigList: [],
      autoApproveKvConfigList: [],
      scopeKvConfigList: [],
      fetchAuthorityList: [],

      appIdList: [],
      query: {
        key: undefined,
        value: undefined,
        appId: undefined,
        desc: undefined
      },
      record: {}
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.fetchKvConfigOptions()
    },
    setQueryParamsFromForm () {
      Object.assign(this.query, this.form.getFieldsValue())
    },
    saveClient (e) {
      this.setQueryParamsFromForm()
      e.preventDefault()

      this.form.validateFields((err, values) => {
        if (err) {
          console.error(err)
          return
        }

        saveClient(this.query).then(res => {
          const source = { success: false, msg: undefined }
          Object.assign(source, res)
          if (source.success) {
            this.$message.success('添加成功')
            this.goBackList()
          }
        })
      })
    },
    fetchKvConfigOptions () {
      findByKeyAndAppId({ key: 'OAUTH2_GRANT_TYPE' }).then(res => {
        const source = { success: false, msg: undefined, data: [] }
        Object.assign(source, res)
        this.grantTypeKvConfigList = source.data
      })
      findByKeyAndAppId({ key: 'OAUTH2_AUTO_APPROVE' }).then(res => {
        const source = { success: false, msg: undefined, data: [] }
        Object.assign(source, res)
        this.autoApproveKvConfigList = source.data
      })
      findByKeyAndAppId({ key: 'OAUTH2_SCOPE' }).then(res => {
        const source = { success: false, msg: undefined, data: [] }
        Object.assign(source, res)
        this.scopeKvConfigList = source.data
      })
    },
    queryAppIdOptions () {
      appIdOptions().then(res => {
        const source = { success: false, msg: undefined, data: [] }
        Object.assign(source, res)
        this.appIdList = source.data
      })
    },
    queryAuthorityOptions (keyword) {
      if (!keyword || keyword === '') {
        return
      }
      authorityOptions({ keyword: keyword }).then(res => {
        const source = { success: false, msg: undefined, data: [] }
        Object.assign(source, res)
        this.appIdList = source.data
      })
    },
    onAppIdChange (e) {
      this.query.appId = e
    },
    validateClientId  (rule, value, callback) {
      if (value === null || value === undefined || value === '') {
        const msg = '请输入客户端ID'
        callback(msg)
      }
      if (!isValidSimpleCode(value)) {
        callback(VALIDATE_ERROR_MSG.commonCode)
      }
      this.query.key = value
      callback()
    },
    validateSecret  (rule, value, callback) {
      if (value === null || value === undefined || value === '') {
        const msg = '请输入密码'
        callback(msg)
      }
      if (!isValidClientSecret(value)) {
        callback(VALIDATE_ERROR_MSG.clientSecret)
      }
      this.query.value = value
      callback()
    },
    validateDesc  (rule, value, callback) {
      if (value === null || value === undefined || value === '') {
        callback()
      }
      if (value && value.length > 255) {
        const msg = '输入超出限制, 最多255个字符'
        callback(msg)
      }
      this.query.remark = value
      callback()
    },
    goBackList () {
      this.$router.push({
        name: 'ClientList'
      })
    }
  }
}
</script>

<style  lang="less" scoped>
</style>
