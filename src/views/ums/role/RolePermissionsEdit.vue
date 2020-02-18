<template>
  <a-card :bordered="false">
    <a-spin :spinning="confirmLoading">
      <detail-list title="角色信息">
        <detail-list-item term="角色ID">{{ record.id }}</detail-list-item>
        <detail-list-item term="角色编码">{{ record.roleCode }}</detail-list-item>
        <detail-list-item term="角色名称">{{ record.roleName }}</detail-list-item>
      </detail-list>
      <div>
        <a-checkbox-group :options="options" :value="checkedValues" @change="onChange" />
      </div>
    </a-spin>
    <a-divider :dashed="true"/>
    <div
      :wrapperCol="{ span: 24 }"
      style="text-align: right">
      <a-button @click="goBackList" style="margin-right: 20px">返回</a-button>
      <a-button type="primary" @click="e=>handleAlloc(e)"><span >确定</span></a-button>
    </div>
  </a-card>
</template>

<script>
import DetailList from '@/components/tools/DetailList'
import { listEnablePermissions } from '@/api/permission'
import { getRoleWithPermissionsById, allocPermissions } from '@/api/role'

const DetailListItem = DetailList.Item

export default {
  name: 'RolePermissionsEdit',
  components: {
    DetailList,
    DetailListItem
  },
  data () {
    return {
      confirmLoading: false,
      routerParams: {
        id: undefined
      },

      options: [],
      checkedValues: [],
      permissions: [],
      record: { id: undefined, roleCode: undefined, roleName: undefined, permissionList: [] },
      query: { id: undefined }
    }
  },
  mounted () {
    this.initParamsFromRouter()
    this.initOptions()
  },
  methods: {
    initParamsFromRouter () {
      Object.assign(this.routerParams, this.$route.query)
      Object.assign(this.query, this.routerParams)
    },
    async  initOptions () {
      await this.queryRoleWithPermissionsById()

      await this.queryEnablePermissions()

      for (let i = 0, iLen = this.permissions.length; i < iLen; i++) {
        const e = { id: undefined, permissionName: undefined }
        Object.assign(e, this.permissions[i])
        if (e.id && e.permissionName) {
          const item = { label: '', value: '' }
          Object.assign(item, { label: e.permissionName, value: e.id })
          this.options.push(item)
        }
      }

      for (let i = 0, iLen = this.record.permissionList.length; i < iLen; i++) {
        const e = { id: undefined }
        Object.assign(e, this.record.permissionList[i])
        if (e.id) {
          this.checkedValues.push(e.id)
        }
      }
    },
    async queryEnablePermissions () {
      this.confirmLoading = true
      await listEnablePermissions().then(res => {
        this.confirmLoading = false
        const source = { success: false, msg: undefined, data: [] }
        Object.assign(source, res)
        Object.assign(this.permissions, source.data)
      })
    },
    async queryRoleWithPermissionsById () {
      this.confirmLoading = true
      await getRoleWithPermissionsById({ id: this.query.id }).then(res => {
        this.confirmLoading = false
        const source = { success: false, msg: undefined, data: {} }
        Object.assign(source, res)
        Object.assign(this.record, source.data)
      })
    },
    handleAlloc () {
      const params = { id: this.record.id, permissionIdList: this.checkedValues }
      this.confirmLoading = true
      allocPermissions(params).then(res => {
        this.confirmLoading = false
        const source = { success: false, msg: undefined, data: {} }
        Object.assign(source, res)
        if (source.success) {
          this.$message.success('权限分配成功')
        }
      })
    },
    onChange (checkedValues) {
      this.checkedValues = [...checkedValues]
    },
    goBackList () {
      this.$router.push({
        name: 'RoleList'
      })
    }
  }
}
</script>

<style scoped>

</style>
