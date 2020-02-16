<template>
  <a-modal
    title="新建键值配置"
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
          label="录入方式"
          hasFeedback
        >
          <a-select v-model="typeInputWay">
            <a-select-option value="0">手动录入</a-select-option>
            <a-select-option value="1">选择已有</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          v-show="typeInputWay=='0'"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="键类型"
          hasFeedback
        >
          <a-input
            placeholder="请输入类型"
            name="inputType"
            v-decorator="[ 'inputType', { rules: [ { required:true, validator: validateCommonCode, }] } ]"/>
        </a-form-item>

        <a-form-item
          v-show="typeInputWay=='1'"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="键类型"
          hasFeedback
        >
          <a-select
            showSearch
            placeholder="请选择类型"
            name="selectType"
            v-decorator="[ 'selectType', { rules: [ { required:true,message:'请选择类型' }] } ]">
            >
            <a-select-option v-for="(type, index) in allKvConfigTypes" :key="index" :value="type">{{ type }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="键名称"
          hasFeedback
        >
          <a-input
            placeholder="请输入键名称"
            name="name"
            v-decorator="[ 'name', { rules: [ { required: true,message: '请输入编码名称', }] } ]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="键编码"
          hasFeedback
        >
          <a-input
            placeholder="请输入键编码"
            name="code"
            v-decorator="[ 'code', { rules: [ { required:true, validator: validateCommonCode, }] } ]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="键值"
          hasFeedback
        >
          <a-input
            placeholder="请输入键值"
            name="value"
            v-decorator="[ 'value', { rules: [ { required: true,message: '请输入值', }] } ]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="描述"
          hasFeedback
        >
          <a-textarea
            placeholder="请输入描述"
            name="description"
            v-decorator="[ 'description', { rules: [ { required: true, min:5,max:255,message: '请输入5-255个字符', }] } ]"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

import { isValidCommonCode, VALIDATE_ERROR_MSG } from '@/utils/validate'
import { listAllKvConfigType, saveKvConfig } from '@/api/kv-config'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import pick from 'lodash.pick'

export default {
  name: 'CreateKvConfigModal',
  components: { AFormItem },
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
      allKvConfigTypes: [],
      typeInputWay: '1',
      kvConfig: {
        code: '',
        value: '',
        name: '',
        type: '',
        inputType: '',
        selectType: '',
        description: ''
      }
    }
  },
  methods: {
    showForm () {
      this.visible = true
      setTimeout(() => {
        this.loadAllKvConfigTypes()
      }, 0)
    },
    loadAllKvConfigTypes () {
      listAllKvConfigType().then(res => {
        console.log('types: ', res)
        if (res || res.success) {
          this.allKvConfigTypes = Object.assign([], res.data)
        } else {
          this.$message.error('获取配置类型出错:', res.msg)
        }
      })
    },
    /**
     *表单验证需要把键类型填充到表单里才能通过验证
     */
    setTypeToForm () {
      const { form } = this
      this.kvConfig = Object.assign({}, form.getFieldsValue())
      if (this.typeInputWay === '0') {
        this.kvConfig.selectType = this.kvConfig.inputType
      } else if (this.typeInputWay === '1') {
        this.kvConfig.inputType = this.kvConfig.selectType
      }
      const formData = pick(this.kvConfig, [ 'inputType', 'selectType' ])
      form.setFieldsValue(formData)
      console.log('form:', form.getFieldsValue())
    },
    setFormValuesToKvConfig () {
      this.kvConfig = Object.assign({}, this.form.getFieldsValue())
      if (this.typeInputWay === '0') {
        this.kvConfig.type = this.kvConfig.inputType
      } else if (this.typeInputWay === '1') {
        this.kvConfig.type = this.kvConfig.selectType
      }
    },
    validateCommonCode  (rule, value, callback) {
      if (!isValidCommonCode(value)) {
        callback(VALIDATE_ERROR_MSG.commonCode)
      }
      callback()
    },
    handleSubmit () {
      this.confirmLoading = true
      this.setTypeToForm()
      this.setFormValuesToKvConfig()
      this.form.validateFields((errors, values) => {
        if (!errors) {
          saveKvConfig(this.kvConfig).then(res => {
            if (res && res.success) {
              this.$message.info('保存配置信息成功')
              this.visible = false
              this.$emit('ok', this.kvConfig)
            } else {
              this.$message.error('保存配置信息成功:', res.msg)
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
