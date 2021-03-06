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
            placeholder="请输入"
            name="id"
            v-decorator="[ 'id', { rules: [ { required: true}] } ]"
            disabled="disabled"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="key"
          hasFeedback
        >
          <a-input
            placeholder="请输入"
            name="key"
            v-decorator="[ 'key', { rules: [ { validator: validateKey, required: true}] } ]"
            disabled="disabled"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="value"
          hasFeedback
        >
          <a-input
            placeholder="请输入"
            name="value"
            v-decorator="[ 'value', { rules: [ { validator: validateValue, required: true}] } ]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="应用">
          <a-select
            showSearch
            placeholder="请选择"
            name="appId"
            @change="onAppIdChange"
            v-decorator="[ 'appId', { rules: [ { required: true,message:'请选择应用'}] } ]">
            <a-select-option v-for="(item, index) in appIdList" :key="index" :value="item.value">{{ item.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="描述"
          hasFeedback
        >
          <a-textarea
            placeholder="请输入"
            :autosize="textAreaSize"
            v-decorator="[ 'desc', { rules: [{validator:validateDesc} ] } ]"/>
        </a-form-item>
        <a-divider :dashed="true"/>
        <a-form-item
          :wrapperCol="{ span: 24 }"
          style="text-align: right">
          <a-button @click="goBackList" style="margin-right: 20px">返回</a-button>
          <a-button type="primary" @click="e=>updateKvConfigById(e)">
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
  isValidLongChineseName
} from '@/utils/validate'
import { updateKvConfig, getKvConfigById } from '@/api/kv-config'
import { appIdOptions } from '@/api/option'

export default {
  name: 'KvConfigEdit',
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
      appIdList: [],
      query: {
        id: undefined,
        key: undefined,
        value: undefined,
        appId: undefined,
        desc: undefined
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
      await this.queryKvConfigById()
      this.fillDataToForm(this.record)
      Object.assign(this.query, this.record)
    },
    fillDataToForm (queryData) {
      this.$nextTick(() => {
        if (!queryData) {
          return
        }

        const data = Object.assign({}, queryData)
        setTimeout(() => {
          this.form.setFieldsValue(data)
        })
      })
    },
    async queryKvConfigById () {
      this.confirmLoading = true
      await getKvConfigById({ id: this.query.id }).then(res => {
        const source = { success: false, msg: undefined, data: {} }
        Object.assign(source, res)
        Object.assign(this.record, source.data)
        this.confirmLoading = false
      })
    },
    updateKvConfigById (e) {
      this.setQueryParamsFromForm()
      e.preventDefault()

      this.form.validateFields((err, values) => {
        if (err) {
          console.error(err)
          return
        }
        updateKvConfig(this.query).then(res => {
          const source = { success: false, msg: undefined }
          Object.assign(source, res)
          if (source.success) {
            this.$message.success('修改成功')
            this.goBackList()
          }
        })
      })
    },
    queryAppIdOptions () {
      appIdOptions().then(res => {
        const source = { success: false, msg: undefined, data: [] }
        Object.assign(source, res)
        this.appIdList = source.data
      })
    },
    onAppIdChange (e) {
      this.query.appId = e
    },
    validateKey  (rule, value, callback) {
      if (value === null || value === undefined || value === '') {
        const msg = '请输入key'
        callback(msg)
      }
      if (!isValidSimpleCode(value)) {
        callback(VALIDATE_ERROR_MSG.commonCode)
      }
      this.query.key = value
      callback()
    },
    validateValue  (rule, value, callback) {
      if (value === null || value === undefined || value === '') {
        const msg = '请输入value'
        callback(msg)
      }
      if (!isValidLongChineseName(value)) {
        callback(VALIDATE_ERROR_MSG.longChineseName)
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
        name: 'KvConfigList'
      })
    }
  }
}
</script>

<style  lang="less" scoped>
</style>
