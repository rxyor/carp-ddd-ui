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
            v-decorator="[ 'key', { rules: [ { validator: validateKvConfigKey, required: true}] } ]"/>
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
            v-decorator="[ 'value', { rules: [ { validator: validateKvConfigValue, required: true}] } ]"/>
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
  isValidCommonCode,
  isValidShortChineseName
} from '@/utils/validate'
import { saveKvConfig } from '@/api/kv-config'

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
    validateKvConfigKey  (rule, value, callback) {
      if (value === null || value === undefined || value === '') {
        const msg = '请输入key'
        callback(msg)
      }
      if (!isValidCommonCode(value)) {
        callback(VALIDATE_ERROR_MSG.commonCode)
      }
      this.query.kvConfigCode = value
      callback()
    },
    validateKvConfigValue  (rule, value, callback) {
      if (value === null || value === undefined || value === '') {
        const msg = '请输入value'
        callback(msg)
      }
      if (!isValidShortChineseName(value)) {
        callback(VALIDATE_ERROR_MSG.shortChineseName)
      }
      this.query.kvConfigName = value
      callback()
    },
    validateDesc  (rule, value, callback) {
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
        name: 'KvConfigList'
      })
    }
  }
}
</script>

<style  lang="less" scoped>
</style>
