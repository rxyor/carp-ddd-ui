<template>
  <a-card :bordered="false">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="key"
          hasFeedback
        >
          <a-input
            placeholder="请输入"
            name="key"
            v-decorator="[ 'key', { rules: [ { validator: validateKey, required: true}] } ]"/>
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
          <a-button type="primary" @click="e=>saveKvConfig(e)">
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
import { saveKvConfig } from '@/api/kv-config'
import { appIdOptions } from '@/api/option'

export default {
  name: 'KvConfigAdd',
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
        key: undefined,
        value: undefined,
        appId: undefined,
        desc: undefined
      },
      record: {}
    }
  },
  mounted () {
    this.queryAppIdOptions()
  },
  methods: {
    setQueryParamsFromForm () {
      Object.assign(this.query, this.form.getFieldsValue())
    },
    saveKvConfig (e) {
      this.setQueryParamsFromForm()
      e.preventDefault()

      this.form.validateFields((err, values) => {
        if (err) {
          console.error(err)
          return
        }

        saveKvConfig(this.query).then(res => {
          const source = { success: false, msg: undefined }
          Object.assign(source, res)
          if (source.success) {
            this.$message.success('添加成功')
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
