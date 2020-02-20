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
          label="加密方式"
          hasFeedback
        >
          <a-select
            showSearch
            :value="select.passwordEncoder"
            placeholder="请选择"
            name="passwordEncoder"
            @change="onPasswordEncoderChange"
          >
            <a-select-option v-for="item in options.passwordEncoderOptionList" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="令牌时效(小时)"
          hasFeedback
        >
          <a-input-number
            v-model="accessTokenValidity"
            style="width: 100%"
            :defaultValue="1"
            :min="1"
            :step="1"
            placeholder="请输入"
            name="accessTokenValidity"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="刷新令牌时效(天)"
          hasFeedback
        >
          <a-input-number
            v-model="refreshTokenValidity"
            style="width: 100%"
            :defaultValue="1"
            :min="1"
            :step="1"
            placeholder="请输入"
            name="refreshTokenValidity"
          />
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
            <a-select-option v-for="(item, index) in options.grantTypeConfigs" :key="index" :value="item.value">{{ item.desc }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="授权码认证模式"
          hasFeedback
        >
          <a-select
            showSearch
            placeholder="请选择"
            name="autoapprove"
            v-decorator="[ 'autoapprove', { rules: [ { required:true,message:'请至少选择一项' }] } ]">
            <a-select-option v-for="(item, index) in options.autoApproveConfigs" :key="index" :value="item.value">{{ item.desc }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="客户端权限"
          hasFeedback
        >
          <a-select
            showSearch
            :defaultActiveFirstOption="false"
            :showArrow="false"
            :filterOption="false"
            notFoundContent="请尝试其他关键字"
            placeholder="请选择"
            mode="multiple"
            @search="fetchAuthorityOptions"
            name="authorityList"
            v-decorator="[ 'authorityList' , { rules: [ { required:true,message:'请至少选择一项' }] } ]">
            <a-select-option v-for="item in options.authorityOptionList" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="访问范围"
          hasFeedback
        >
          <a-select
            showSearch
            mode="multiple"
            placeholder="请选择"
            name="scopeList"
            v-decorator="[ 'scopeList', { rules: [ { required:true,message:'请至少选择一项' }] } ]">
            <a-select-option v-for="(item, index) in options.scopeConfigs" :key="index" :value="item.value">{{ item.desc }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="应用(或资源)ID"
          hasFeedback
        >
          <a-select
            showSearch
            mode="multiple"
            placeholder="2次回车输入并选择"
            @search="value => resource.cur = value"
            @inputKeydown="handleResInput"
            name="resourceIdList"
            v-decorator="[ 'resourceIdList' , { rules: [ { required:true,message:'请至少选择一项' }] } ]">
            <a-select-option v-for="(item, index) in resource.list" :key="index" :value="item">{{ item }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="跳转URI"
          hasFeedback
        >
          <a-select
            showSearch
            mode="multiple"
            placeholder="2次回车输入并选择"
            @search="value => uri.cur = value"
            @inputKeydown="handleUrlInput"
            name="webServerRedirectUriList"
            v-decorator="[ 'webServerRedirectUriList' ]">
            <a-select-option v-for="(item, index) in uri.list" :key="index" :value="item">{{ item }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="附加信息"
          hasFeedback
        >
          <a-textarea
            placeholder="请输入"
            name="additionalInformation"
            v-decorator="[ 'additionalInformation', { rules: [ {max:4096,message: '请输入0-512个字符', }] } ]"/>
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
  isValidClientSecret,
  isValidCommonName,
  isValidSimpleCode,
  isValidUrlSimple,
  VALIDATE_ERROR_MSG
} from '@/utils/validate'
import { saveClient } from '@/api/client'
import { findByKeyAndAppId } from '@/api/kv-config'
import { authorityOptions, passwordEncoderOptions } from '@/api/option'

const regexp = /\{[a-zA-z0-9-]+\}/

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

      select: {
        passwordEncoder: '',
        refreshTokenValidity: 1,
        accessTokenValidity: 1
      },

      options: {
        grantTypeConfigs: [],
        autoApproveConfigs: [],
        scopeConfigs: [],
        authorityOptionList: [],
        passwordEncoderOptionList: []
      },

      resource: { cur: '', last: '', list: [] },
      uri: { cur: '', last: '', list: [] },

      query: {
        refreshTokenValidity: 86400,
        accessTokenValidity: 3600
      }
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    accessTokenValidity: {
      get: function () {
        return parseInt(this.query.accessTokenValidity / 3600)
      },
      set: function (newValue) {
        this.query.accessTokenValidity = newValue * 3600
      }
    },
    refreshTokenValidity: {
      get: function () {
        return parseInt(this.query.refreshTokenValidity / 86400)
      },
      set: function (newValue) {
        this.query.refreshTokenValidity = newValue * 86400
      }
    }
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

        Object.assign(this.query, values, {
          authorizedGrantTypes: values.authorizedGrantTypeList && values.authorizedGrantTypeList.join(','),
          authorities: values.authorityList && values.authorityList.join(','),
          scope: values.scopeList && values.scopeList.join(','),
          resourceIds: values.resourceIdList && values.resourceIdList.join(','),
          webServerRedirectUri: values.webServerRedirectUriList && values.webServerRedirectUriList.join(',')
        })

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
        this.options.grantTypeConfigs = source.data
      })
      findByKeyAndAppId({ key: 'OAUTH2_AUTO_APPROVE' }).then(res => {
        const source = { success: false, msg: undefined, data: [] }
        Object.assign(source, res)
        this.options.autoApproveConfigs = source.data
      })
      findByKeyAndAppId({ key: 'OAUTH2_SCOPE' }).then(res => {
        const source = { success: false, msg: undefined, data: [] }
        Object.assign(source, res)
        this.options.scopeConfigs = source.data
      })
      passwordEncoderOptions().then(res => {
        const source = { success: false, msg: undefined, data: [] }
        Object.assign(source, res)
        this.options.passwordEncoderOptionList = source.data
      })
    },
    fetchAuthorityOptions (keyword) {
      if (!keyword || keyword === '') {
        return
      }
      authorityOptions({ keyword: keyword }).then(res => {
        const source = { success: false, msg: undefined, data: [] }
        Object.assign(source, res)
        this.options.authorityOptionList = source.data
      })
    },
    validateClientId  (rule, value, callback) {
      if (value === null || value === undefined || value === '') {
        const msg = '请输入客户端ID'
        callback(msg)
      }
      if (!isValidSimpleCode(value)) {
        callback(VALIDATE_ERROR_MSG.commonCode)
      }
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
      callback()
    },
    handleResInput (e) {
      this.handleInput(e, this.resource, this.isValidResource)
    },
    handleUrlInput (e) {
      this.handleInput(e, this.uri, this.isValidUri)
    },
    handleInput (e, o, f) {
      if (e.code === 'Enter' || e.keyCode === 13) {
        if (o.last === o.cur) {
          return
        }
        if (o.cur && o.cur.trim().length > 0) {
          if (!f(o.cur)) {
            return
          }
          const set = new Set(o.list)
          set.add(o.cur)
          o.last = o.cur
          o.list = Object.assign([], Array.from(set))
        }
      }
    },
    isValidUri (uri) {
      if (!isValidUrlSimple(uri)) {
        this.$message.warn(VALIDATE_ERROR_MSG.url)
        return false
      }
      return true
    },
    isValidResource (uri) {
      if (!isValidCommonName(uri)) {
        this.$message.warn(VALIDATE_ERROR_MSG.commonName)
        return false
      }
      return true
    },
    onPasswordEncoderChange (v) {
      this.select.passwordEncoder = v
      const data = this.form.getFieldsValue()
      Object.assign(data, { clientSecret: v + data.clientSecret.replace(regexp, '') })
      this.form.setFieldsValue(data)
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
