<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="权限ID">
              <a-input v-model="queryParam.id" placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="权限编码">
              <a-input v-model="queryParam.permissionCode" placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="权限名称">
              <a-input v-model="queryParam.permissionName" placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="权限">
              <a-select v-model="queryParam.disable" placeholder="请选择" default-value="">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="0">启用</a-select-option>
                <a-select-option value="1">已禁用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" icon="plus" @click="$refs.createPermissionModal.showForm()">新建</a-button>
              <a-button style="margin-left: 8px" type="primary" icon="search"@click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
    >
      <span slot="disable" slot-scope="text">
        <a-badge :status="text | disableTypeFilter" :text="text | disableFilter" />
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-dropdown>
          <a class="ant-dropdown-link">
            更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item v-show="record.disable == 0">
              <a href="javascript:;" @click="handleDisable(record.id)">禁用</a>
            </a-menu-item>
            <a-menu-item v-show="record.disable == 1">
              <a href="javascript:;"@click="handleEnable(record.id)">启用</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;" @click="handleDelete(record.id)">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </s-table>

    <create-permission-modal ref="createPermissionModal" @ok="handleAddOk"></create-permission-modal>
    <edit-permission-modal ref="editPermissionModal" @ok="handleEditOk"></edit-permission-modal>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { queryPermissionByPage, enablePermission, disablePermission, deletePermission } from '@/api/permission'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import CreatePermissionModal from './modules/CreatePermissionModal'
import EditPermissionModal from './modules/EditPermissionModal'

const disableMap = {
  0: {
    status: 'success',
    text: '启用'
  },
  1: {
    status: 'default',
    text: '禁用'
  }
}

export default {
  name: 'PermissionList',
  components: {
    CreatePermissionModal,
    EditPermissionModal,
    AFormItem,
    STable
  },
  data () {
    return {
      editVisible: false,
      addVisible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      form: null,
      mdl: {},
      // 当前编辑Record
      currentEditRecord: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '权限ID',
          dataIndex: 'id'
        },
        {
          title: '权限编码',
          dataIndex: 'permissionCode'
        },
        {
          title: '权限名称',
          dataIndex: 'permissionName'
        },
        {
          title: '权限描述',
          dataIndex: 'permissionDesc'
        },
        {
          title: '状态',
          dataIndex: 'disable',
          scopedSlots: { customRender: 'disable' }
        },
        {
          title: '创建时间',
          dataIndex: 'createDate'
        }, {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('loadPermisions:', parameter)
        this.mdl = {}
        parameter.pageIndex = parameter.pageNo
        Object.assign(this.queryParam, parameter)
        return queryPermissionByPage(this.queryParam)
          .then(res => {
            const result = {}
            if (res || res.success || res.data) {
              result.pageNo = res.data.current
              result.pageSize = res.data.size
              result.totalCount = res.data.total
              result.totalPage = res.data.pages
              result.data = res.data.records
            }
            return result
          })
      },

      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
    disableFilter (type) {
      return disableMap[type].text
    },
    disableTypeFilter (type) {
      return disableMap[type].status
    }
  },
  methods: {
    handleEdit (record) {
      this.currentEditRecord = Object.assign({}, record)
      this.$refs.editPermissionModal.showForm(this.currentEditRecord)
    },
    handleDisable (id) {
      const params = { permissionId: id }
      return disablePermission(params)
        .then(res => {
          if (res || res.success || res.data) {
            this.$refs.table.refresh(true)
            this.$message.info('禁用权限成功')
          } else {
            this.$message.error('禁用权限失败')
          }
        })
    },
    handleEnable (id) {
      const params = { permissionId: id }
      return enablePermission(params)
        .then(res => {
          if (res || res.success || res.data) {
            this.$refs.table.refresh(true)
            this.$message.info('启用权限成功')
          } else {
            this.$message.error('启用权限失败')
          }
        })
    },
    handleDelete (id) {
      const params = { permissionId: id }
      return deletePermission(params)
        .then(res => {
          if (res || res.success || res.data) {
            this.$refs.table.refresh(true)
            this.$message.info('删除权限成功')
          } else {
            this.$message.error('删除权限失败')
          }
        })
    },
    handleEditOk (data) {
      this.$refs.table.refresh(true)
    },
    handleAddOk (data) {
      this.$refs.table.refresh(true)
    },
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  },
  watch: {
  }
}
</script>
