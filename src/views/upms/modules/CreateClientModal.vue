<template>
  <a-modal
    title="新建客户端"
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
          label="客户端ID"
          hasFeedback
        >
          <a-input
            placeholder="请输入"
            name="clientId"
            v-decorator="[ 'clientId', { rules: [ { required:true, validator: validateCommonName, }] } ]"/>
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
            v-decorator="[ 'clientSecret', { rules: [ { required:true, validator: validateCommonName, }] } ]"/>
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
            <a-select-option v-for="(kvConfig, index) in grantTypeKvConfigList" :key="index" :value="kvConfig.value">{{ kvConfig.code }}</a-select-option>
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
            <a-select-option v-for="(kvConfig, index) in autoApproveKvConfigList" :key="index" :value="kvConfig.value">{{ kvConfig.code }}</a-select-option>
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
            mode="multiple"
            placeholder="请选择"
            name="authorityList"
            @search="loadAuthorities"
            v-decorator="[ 'authorityList' ]"
          >
            <a-select-option v-for="(authorityCode, index) in fetchAuthorityList" :key="index" :value="authorityCode">{{ authorityCode }}</a-select-option>
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
            v-decorator="[ 'scopeList']">
            <a-select-option v-for="(kvConfig, index) in scopeKvConfigList" :key="index" :value="kvConfig.value">{{ kvConfig.code }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="资源ID"
          hasFeedback
        >
          <a-select
            showSearch
            mode="multiple"
            placeholder="按下回车保存输入值"
            @search="value => currentInputResourceId = value"
            @inputKeydown="handleResourceIdSelectEnterKeyDown"
            name="resourceIdList"
            v-decorator="[ 'resourceIdList' ]">
            <a-select-option v-for="(resourceId, index) in resourceIdAddList" :key="index" :value="resourceId">{{ resourceId }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="令牌时效(秒)"
          hasFeedback
        >
          <a-input-number
            v-model="accessTokenValidity"
            style="width: 100%"
            :defaultValue="3600"
            :min="60"
            :step="3600"
            placeholder="请输入"
            name="accessTokenValidity"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="刷新令牌时效(秒)"
          hasFeedback
        >
          <a-input-number
            v-model="refreshTokenValidity"
            style="width: 100%"
            :defaultValue="3600"
            :min="60"
            :step="3600"
            placeholder="请输入"
            name="refreshTokenValidity"
          />
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
            placeholder="按下回车保存输入值"
            @search="value => currentInputWebUrl = value"
            @inputKeydown="handleWebUrlSelectEnterKeyDown"
            name="webServerRedirectUriList"
            v-decorator="[ 'webServerRedirectUriList' ]">
            <a-select-option v-for="(url, index) in webUrlAddList" :key="index" :value="url">{{ url }}</a-select-option>
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
            v-decorator="[ 'additionalInformation', { rules: [ {max:512,message: '请输入0-512个字符', }] } ]"/>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

import { isValidCommonCode, isValidCommonName, isValidUrlSimple, VALIDATE_ERROR_MSG } from '@/utils/validate'
import { listKvConfigByType } from '@/api/kv-config'
import { queryClientAuthoritiesByCode, saveClientDetail } from '@/api/client'
import AFormItem from 'ant-design-vue/es/form/FormItem'

export default {
  name: 'CreateClientModal',
  components: {
    AFormItem,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
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

      currentInputResourceId: '',
      lastInputResourceId: '',
      resourceIdAddList: [],
      currentInputWebUrl: '',
      lastInputWebUrl: '',
      webUrlAddList: [],
      allKvConfigTypes: [],
      grantTypeKvConfigList: [],
      autoApproveKvConfigList: [],
      scopeKvConfigList: [],
      fetchAuthorityList: [],

      refreshTokenValidity: 60 * 60 * 24 * 30,
      accessTokenValidity: 60 * 60 * 24,

      clientDetail: {
        resourceIdList: '',
        scopeList: '',
        authorizedGrantTypeList: '',
        authorityList: '',
        autoapprove: '',
        webServerRedirectUriList: '',
        refreshTokenValidity: undefined,
        accessTokenValidity: undefined,
        additionalInformation: ''
      }
    }
  },
  methods: {
    showForm () {
      this.visible = true
      setTimeout(() => {
        this.loadNeedKvConfig()
      }, 0)
    },
    loadNeedKvConfig () {
      listKvConfigByType({ 'type': 'OAUTH2_GRANT_TYPE' }).then(res => {
        if (res || res.success) {
          this.grantTypeKvConfigList = Object.assign([], res.data)
        }
      })
      listKvConfigByType({ 'type': 'OAUTH2_AUTO_APPROVE' }).then(res => {
        if (res || res.success) {
          this.autoApproveKvConfigList = Object.assign([], res.data)
        }
      })
      listKvConfigByType({ 'type': 'OAUTH2_SCOPE' }).then(res => {
        if (res || res.success) {
          this.scopeKvConfigList = Object.assign([], res.data)
        }
      })
    },
    loadAuthorities (value) {
      if (!value || value === '') {
        return
      }
      queryClientAuthoritiesByCode({ 'code': value }).then(res => {
        if (res || res.success) {
          this.fetchAuthorityList = Object.assign([], res.data)
        }
      })
    },
    handleResourceIdSelectEnterKeyDown (keyboardEvent) {
      if (keyboardEvent.code === 'Enter' || keyboardEvent.keyCode === 13) {
        if (this.lastInputResourceId === this.currentInputResourceId) {
          return
        }
        if (this.currentInputResourceId && this.currentInputResourceId.trim().length > 0) {
          if (!isValidCommonName(this.currentInputResourceId)) {
            this.$message.warn(VALIDATE_ERROR_MSG.commonName)
            return
          }
          const set = new Set(this.resourceIdAddList)
          set.add(this.currentInputResourceId)
          this.lastInputResourceId = this.currentInputResourceId
          this.resourceIdAddList = []
          this.resourceIdAddList = Object.assign([], Array.from(set))
        }
      }
    },
    handleWebUrlSelectEnterKeyDown (keyboardEvent) {
      if (keyboardEvent.code === 'Enter' || keyboardEvent.keyCode === 13) {
        if (this.lastInputWebUrl === this.currentInputWebUrl) {
          return
        }
        if (this.currentInputWebUrl && this.currentInputWebUrl.trim().length > 0) {
          if (!isValidUrlSimple(this.currentInputWebUrl)) {
            this.$message.warn(VALIDATE_ERROR_MSG.url)
            return
          }
          const set = new Set(this.webUrlAddList)
          set.add(this.currentInputWebUrl)
          this.lastInputWebUrl = this.currentInputWebUrl
          this.webUrlAddList = []
          this.webUrlAddList = Object.assign([], Array.from(set))
        }
      }
    },
    setFormValuesToClientDetail  () {
      this.clientDetail = Object.assign({}, this.form.getFieldsValue())
      this.clientDetail.accessTokenValidity = this.accessTokenValidity
      this.clientDetail.refreshTokenValidity = this.refreshTokenValidity
    },
    validateCommonCode  (rule, value, callback) {
      if (!isValidCommonCode(value)) {
        callback(VALIDATE_ERROR_MSG.commonCode)
      }
      callback()
    },
    validateCommonName  (rule, value, callback) {
      if (!isValidCommonName(value)) {
        callback(VALIDATE_ERROR_MSG.commonName)
      }
      callback()
    },
    validateUrl  (rule, value, callback) {
      if (!value || value.trim().length === 0) {
        callback()
      }
      if (!isValidUrlSimple(value)) {
        callback(VALIDATE_ERROR_MSG.url)
      }
      callback()
    },
    handleSubmit () {
      this.confirmLoading = true
      this.setFormValuesToClientDetail()
      this.form.validateFields((errors, values) => {
        if (!errors) {
          saveClientDetail(this.clientDetail).then(res => {
            if (res && res.success) {
              this.$message.info('保存Client信息成功')
              this.visible = false
              this.$emit('ok', this.kvConfig)
            } else {
              this.$message.error('保存Client信息成功:', res.msg)
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
