<template>
  <a-modal
    title="编辑角色"
    :width="1000"
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
          label="用户名"
          hasFeedback
        >
          <a-input
            placeholder="请输入用户名"
            name="username"
            v-decorator="[ 'username', { rules: [ { validator: validateUsername, }] } ]"
            disabled="disabled" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="密码"
          hasFeedback
        >
          <a-input
            placeholder="请输入密码"
            name="password"
            type="password"
            v-decorator="[ 'password', { rules: [ { validator: validatePassword, }] } ]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="确认密码"
          hasFeedback
        >
          <a-input
            placeholder="请再次输入密码"
            name="confirmPassword"
            type="password"
            v-decorator="[ 'confirmPassword', { rules: [ { validator: validateConfirmPassword, }] } ]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="状态"
          hasFeedback
          validateStatus="warning"
        >
          <a-select
            v-decorator="['status', {rules: [{ required: true, message: '请选择状态' }], initialValue: '0'}]">
            <a-select-option value="0">正常</a-select-option>
            <a-select-option value="1">禁用</a-select-option>
          </a-select>
        </a-form-item>

        <a-divider />

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="分配权限"
          hasFeedback
        >
          <a-transfer
            :dataSource="transfer.data"
            :titles="['可分配权限', '已分配权限']"
            showSearch
            :listStyle="{ width: '215px', height: '300px', }"
            :operations="['分配', '取消']"
            :targetKeys="transfer.keys"
            @change="handleTransferChange"
            :render="item=>`${item.roleCode}(${item.roleName})`" >
            <a-button size="small" style="float:right;margin: 5px" @click="handleAssignRoles" slot="footer" >确认分配</a-button>
            <span slot="notFoundContent" >无数据</span>
          </a-transfer>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

import { VALIDATE_ERROR_MSG, isValidUsername, isValidSimplePassword } from '@/utils/validate'
import { updateUser } from '@/api/user'
import { listAllEnableRoles, insertBatchUserRoleRelationByUserId, deleteBatchUserRoleRelationByUserId } from '@/api/role'
import pick from 'lodash.pick'

export default {
  name: 'EditUserModal',
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
      visible: false,
      confirmLoading: false,

      form: this.$form.createForm(this),

      user: {
        id: undefined,
        username: undefined,
        password: undefined,
        status: undefined,
        disable: undefined
      },
      transfer: {
        data: [],
        keys: []
      }
    }
  },
  mounted () {
    this.fillValuesToEditForm(this.user)
  },
  watch: {
    visible: function (newValue) {
      if (newValue) {
        this.initTransferDataAndKeys()
      }
    }
  },
  methods: {
    showForm (data) {
      this.$nextTick(() => {
        this.user = Object.assign({}, data)
        this.fillValuesToEditForm(this.user)
      })
      this.visible = true
    },
    fillValuesToEditForm (data) {
      const { form } = this
      if (data.disable) {
        data.status = data.disable.toString()
      }
      data.confirmPassword = data.password
      const formData = pick(data, ['id', 'username', 'password', 'confirmPassword', 'status'])
      setTimeout(() => {
        form.setFieldsValue(formData)
      }, 0)
    },
    setFormValuesToRole () {
      this.user = Object.assign(this.user, this.form.getFieldsValue())
      this.user.disable = parseInt(this.user.status)
    },
    validateUsername  (rule, value, callback) {
      if (value === null || value === undefined || value === '') {
        callback()
      }
      if (!isValidUsername(value)) {
        callback(VALIDATE_ERROR_MSG.username)
      }
      this.user.username = value
      callback()
    },
    validatePassword  (rule, value, callback) {
      if (value === null || value === undefined || value === '') {
        callback()
      }
      if (!isValidSimplePassword(value)) {
        callback(VALIDATE_ERROR_MSG.simplePassword)
      }
      this.user.password = value
      callback()
    },
    validateConfirmPassword  (rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('password')) {
        callback(VALIDATE_ERROR_MSG.confirmPassword)
      }
      callback()
    },
    loadAllRoles () {
      return listAllEnableRoles()
        .then((res) => {
          if (res || res.success) {
            return res.data
          }
        })
    },
    async initTransferDataAndKeys () {
      this.transfer.data = []
      const roles = await this.loadAllRoles()
      if (roles && roles.length > 0) {
        for (let i = 0; i < roles.length; i++) {
          const item = {
            key: roles[i].id.toString(),
            title: roles[i].roleName
          }
          Object.assign(item, roles[i])
          this.transfer.data.push(item)
        }
      }
      this.transfer.keys = []
      if (!this.user.roles) {
        return
      }
      for (let i = 0, len = this.user.roles.length; i < len; i++) {
        this.transfer.keys.push(this.user.roles[i].id.toString())
      }
      return this.transfer.data
    },
    handleTransferChange (nextTargetKeys, direction, moveKeys) {
      this.transfer.keys = nextTargetKeys
    },
    handleAssignRoles () {
      const userId = this.user.id
      const insertRoleIds = []
      const deleteRoleIds = []
      const publicRoleIds = []
      for (let i = 0, iLen = this.user.roles.length; i < iLen; i++) {
        const permissionId = this.user.roles[i].id
        for (let j = 0, jLen = this.transfer.keys.length; j < jLen; j++) {
          const targetKey = this.transfer.keys[j]
          if (permissionId.toString() === targetKey) {
            publicRoleIds.push(permissionId)
          }
        }
      }

      for (let i = 0, iLen = this.user.roles.length; i < iLen; i++) {
        let found = false
        for (let k = 0, kLen = publicRoleIds.length; k < kLen; k++) {
          const publicRoleId = publicRoleIds[k]
          if (publicRoleId === this.user.roles[i].id) {
            found = true
            break
          }
        }
        if (!found) {
          deleteRoleIds.push(this.user.roles[i].id)
        }
      }

      for (let j = 0, jLen = this.transfer.keys.length; j < jLen; j++) {
        let found = false
        for (let k = 0, kLen = publicRoleIds.length; k < kLen; k++) {
          const publicRoleId = publicRoleIds[k]
          if (publicRoleId.toString() === this.transfer.keys[j]) {
            found = true
            break
          }
        }
        if (!found) {
          insertRoleIds.push(parseInt(this.transfer.keys[j]))
        }
      }

      const deleteParams = { userId: userId, roleIds: deleteRoleIds }
      const insertParams = { userId: userId, roleIds: insertRoleIds }

      let success = true
      deleteBatchUserRoleRelationByUserId(deleteParams).then(res => {
        success = (res && res.success)
      })
      insertBatchUserRoleRelationByUserId(insertParams).then(res => {
        success = (res && res.success)
      })

      if (success) {
        this.$message.info('修改角色成功')
      } else {
        this.$message.error('修改角色失败')
      }
      this.$emit('assignRoleOk', this.user)
    },
    handleSubmit () {
      this.confirmLoading = true
      this.form.validateFields((errors, values) => {
        if (!errors) {
          this.setFormValuesToRole()
          updateUser(this.user).then(res => {
            if (res && res.success) {
              this.$message.info('修改用户信息成功')
              this.visible = false
              this.$emit('ok', this.user)
            } else {
              this.$message.error('修改用户信息失败')
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
