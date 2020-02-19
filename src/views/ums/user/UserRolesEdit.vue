<template>
  <a-card :bordered="false">
    <a-spin :spinning="confirmLoading">
      <detail-list title="用户信息">
        <detail-list-item term="用户名">{{ record.username }}</detail-list-item>
        <detail-list-item term="昵称">{{ record.nickname }}</detail-list-item>
        <detail-list-item term="手机号">{{ record.phone }}</detail-list-item>
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
import { listEnableRoles } from '@/api/role'
import { getUserWithRolesById, allocRoles } from '@/api/user'

const DetailListItem = DetailList.Item

export default {
  name: 'UserRolesEdit',
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
      roles: [],
      record: { id: undefined, username: undefined, nickname: undefined, phone: undefined, roleList: [] },
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
    async initOptions () {
      await this.queryUserWithRolesById()

      await this.queryEnableRoles()

      for (let i = 0, iLen = this.roles.length; i < iLen; i++) {
        const e = { id: undefined, roleName: undefined }
        Object.assign(e, this.roles[i])
        if (e.id && e.roleName) {
          const item = { label: '', value: '' }
          Object.assign(item, { label: e.roleName, value: e.id })
          this.options.push(item)
        }
      }

      for (let i = 0, iLen = this.record.roleList.length; i < iLen; i++) {
        const e = { id: undefined }
        Object.assign(e, this.record.roleList[i])
        if (e.id) {
          this.checkedValues.push(e.id)
        }
      }
    },
    async queryEnableRoles () {
      this.confirmLoading = true
      await listEnableRoles().then(res => {
        this.confirmLoading = false
        const source = { success: false, msg: undefined, data: [] }
        Object.assign(source, res)
        Object.assign(this.roles, source.data)
      })
    },
    async queryUserWithRolesById () {
      this.confirmLoading = true
      await getUserWithRolesById({ id: this.query.id }).then(res => {
        this.confirmLoading = false
        const source = { success: false, msg: undefined, data: {} }
        Object.assign(source, res)
        Object.assign(this.record, source.data)
      })
    },
    handleAlloc () {
      const params = { id: this.record.id, roleIdList: this.checkedValues }
      this.confirmLoading = true
      allocRoles(params).then(res => {
        this.confirmLoading = false
        const source = { success: false, msg: undefined, data: {} }
        Object.assign(source, res)
        if (source.success) {
          this.$message.success('角色分配成功')
        }
      })
    },
    onChange (checkedValues) {
      this.checkedValues = [...checkedValues]
    },
    goBackList () {
      this.$router.push({
        name: 'UserList'
      })
    }
  }
}
</script>

<style scoped>

</style>
