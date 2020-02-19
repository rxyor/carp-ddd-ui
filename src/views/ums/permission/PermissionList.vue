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
            <a-form-item label="状态">
              <a-select v-model="queryParam.disable" placeholder="请选择" default-value="">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="0">启用</a-select-option>
                <a-select-option value="1">已禁用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
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
              <a style="color: red" href="javascript:;" @click="handleDelete(record.id)">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </s-table>

  </a-card>
</template>

<script>
import { STable } from '@/components'
import { permissionPage, enablePermission, disablePermission, deletePermission } from '@/api/permission'
import AFormItem from 'ant-design-vue/es/form/FormItem'

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
  name: 'TableList',
  components: {
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
      loadData: param => {
        Object.assign(this.queryParam, { page: param.pageNo, pageSize: param.pageSize })

        return permissionPage(this.queryParam).then(res => {
          const source = { success: false, msg: undefined, data: { content: [], totalPages: 1, totalElements: 0, size: 0, number: 0 } }
          Object.assign(source, res)

          if (!source.success) {
            this.$message.error('请求权限数据失败')
            console.error(res)
          }
          const data = source.data

          const ret = { pageNo: 1, pageSize: 10, totalCount: 0, totalPage: 1, data: [] }
          Object.assign(ret, { pageNo: data.number + 1, pageSize: data.size, totalCount: data.totalElements, totalPage: data.totalPages, data: data.content })
          return ret
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
    handleAdd () {
      this.$router.push({ name: 'PermissionAdd' })
    },
    handleEdit (record) {
      this.$router.push({ name: 'PermissionEdit', query: { id: record.id } })
    },
    handleDisable (id) {
      return disablePermission({ id: id }).then(res => {
        const source = { success: false, msg: undefined }
        Object.assign(source, res)

        if (source.success) {
          this.$refs.table.refresh(true)
          this.$message.info('禁用权限成功')
        } else {
          this.$message.error('禁用权限失败')
          console.error(res)
        }
      })
    },
    handleEnable (id) {
      return enablePermission({ id: id }).then(res => {
        const source = { success: false }
        Object.assign(source, res)
        if (source.success) {
          this.$refs.table.refresh(true)
          this.$message.info('启用权限成功')
        } else {
          this.$message.error('启用权限失败')
        }
      })
    },
    handleDelete (id) {
      return deletePermission({ id: id }).then(res => {
        const source = { success: false }
        Object.assign(source, res)
        if (source.success) {
          this.$refs.table.refresh(true)
          this.$message.info('删除权限成功')
        } else {
          this.$message.error('删除权限失败')
        }
      })
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  }
}
</script>
