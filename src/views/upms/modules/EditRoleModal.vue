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
          label="角色ID"
          hasFeedback
          validateStatus="success"
        >
          <a-input placeholder="角色ID" v-decorator="['id', {rules: [{ required: true, message: '请输入ID' }]}]"name="id" disabled="disabled" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色编码"
          hasFeedback
        >
          <a-input
            placeholder="请输入角色编码"
            id="roleCode"
            name="roleCode"
            v-decorator="[ 'roleCode', { rules: [ { required:true, validator: validateRoleCode, }] } ]"
            disabled="disabled" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色名称"
          hasFeedback
        >
          <a-input
            placeholder="请输入角色名称"
            name="roleName"
            v-decorator="[ 'roleName', { rules: [ { required: true, min:2,max:50,message: '请输入2-50个字符', }] } ]"/>
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

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色描述"
          hasFeedback
        >
          <a-textarea
            placeholder="请输入描述"
            name="roleDesc"
            v-decorator="[ 'roleDesc', { rules: [ { required: true, min:5,max:100,message: '请输入5-100个字符', }] } ]"/>
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
            :render="item=>`${item.permissionCode}(${item.permissionName})`" >
            <a-button size="small" style="float:right;margin: 5px" @click="handleAssignPermissions" slot="footer" >确认分配</a-button>
            <span slot="notFoundContent" >无数据</span>
          </a-transfer>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

import { VALIDATE_ERROR_MSG, isValidRoleCode } from '@/utils/validate'
import { listAllEnablePermissions, insertBatchRolePermissionRelationByRoleId, deleteBatchRolePermissionRelationByRoleId } from '@/api/permission'
import { updateRole } from '@/api/role'
import pick from 'lodash.pick'

export default {
  name: 'EditRoleModal',
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

      role: {
        id: undefined,
        roleName: undefined,
        roleCode: undefined,
        roleDesc: undefined,
        permissions: undefined,
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
    this.fillValuesToEditForm(this.role)
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
        this.role = Object.assign({}, data)
        this.fillValuesToEditForm(this.role)
      })
      this.visible = true
    },
    fillValuesToEditForm (data) {
      const { form } = this
      if (data.disable) {
        data.status = data.disable.toString()
      }
      const formData = pick(data, ['id', 'roleName', 'roleCode', 'roleDesc', 'status'])
      setTimeout(() => {
        form.setFieldsValue(formData)
      }, 0)
    },
    setFormValuesToRole () {
      this.role = Object.assign(this.role, this.form.getFieldsValue())
      this.role.disable = parseInt(this.role.status)
    },
    validateRoleCode  (rule, value, callback) {
      if (!isValidRoleCode(value)) {
        callback(VALIDATE_ERROR_MSG.roleCode)
      }
      this.role.roleCode = value
      callback()
    },
    loadAllPermissions () {
      return listAllEnablePermissions()
        .then((res) => {
          if (res || res.success) {
            return res.data
          }
        })
    },
    async initTransferDataAndKeys () {
      this.transfer.data = []
      const permissions = await this.loadAllPermissions()
      if (permissions && permissions.length > 0) {
        for (let i = 0; i < permissions.length; i++) {
          const item = {
            key: permissions[i].id.toString(),
            title: permissions[i].permissionName
          }
          Object.assign(item, permissions[i])
          this.transfer.data.push(item)
        }
      }
      this.transfer.keys = []
      if (!this.role.permissions) {
        return
      }
      for (let i = 0, len = this.role.permissions.length; i < len; i++) {
        this.transfer.keys.push(this.role.permissions[i].id.toString())
      }
      return this.transfer.data
    },
    handleTransferChange (nextTargetKeys, direction, moveKeys) {
      this.transfer.keys = nextTargetKeys
    },
    handleAssignPermissions () {
      const roleId = this.role.id
      const insertPermissionIds = []
      const deletePermissionIds = []
      const publicPermissionIds = []
      console.log('this.role: ', this.role)
      for (let i = 0, iLen = this.role.permissions.length; i < iLen; i++) {
        const permissionId = this.role.permissions[i].id
        for (let j = 0, jLen = this.transfer.keys.length; j < jLen; j++) {
          const targetKey = this.transfer.keys[j]
          if (permissionId.toString() === targetKey) {
            publicPermissionIds.push(permissionId)
          }
        }
      }

      for (let i = 0, iLen = this.role.permissions.length; i < iLen; i++) {
        let found = false
        for (let k = 0, kLen = publicPermissionIds.length; k < kLen; k++) {
          const publicPermissionId = publicPermissionIds[k]
          if (publicPermissionId === this.role.permissions[i].id) {
            found = true
            break
          }
        }
        if (!found) {
          deletePermissionIds.push(this.role.permissions[i].id)
        }
      }

      for (let j = 0, jLen = this.transfer.keys.length; j < jLen; j++) {
        let found = false
        for (let k = 0, kLen = publicPermissionIds.length; k < kLen; k++) {
          const publicPermissionId = publicPermissionIds[k]
          if (publicPermissionId.toString() === this.transfer.keys[j]) {
            found = true
            break
          }
        }
        if (!found) {
          insertPermissionIds.push(parseInt(this.transfer.keys[j]))
        }
      }

      const deleteParams = { roleId: roleId, permissionIds: deletePermissionIds }
      const insertParams = { roleId: roleId, permissionIds: insertPermissionIds }

      let success = true
      deleteBatchRolePermissionRelationByRoleId(deleteParams).then(res => {
        success = (res && res.success)
      })
      insertBatchRolePermissionRelationByRoleId(insertParams).then(res => {
        success = (res && res.success)
      })

      if (success) {
        this.$message.info('修改权限成功')
      } else {
        this.$message.error('修改权限失败')
      }
      this.$emit('assignPermissionOk', this.role)
    },
    handleSubmit () {
      this.confirmLoading = true
      this.form.validateFields((errors, values) => {
        if (!errors) {
          this.setFormValuesToRole()
          updateRole(this.role).then(res => {
            if (res && res.success) {
              this.$message.info('修改角色信息成功')
              this.visible = false
              this.$emit('ok', this.role)
            } else {
              this.$message.error('修改角色信息失败')
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
