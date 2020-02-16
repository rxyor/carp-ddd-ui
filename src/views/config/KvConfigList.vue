<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="ID">
              <a-input v-model="queryParam.id" placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="键编码">
              <a-input v-model="queryParam.code" placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="键名称">
                <a-input v-model="queryParam.name" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="键类型">
                <a-input v-model="queryParam.type" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="键值">
                <a-input v-model="queryParam.value" placeholder="请输入"/>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" icon="plus" @click="$refs.createKvConfigModal.showForm()">新建</a-button>
              <a-button style="margin-left: 8px" type="primary" icon="search"@click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
    >
      <div
        slot="expandedRowRender"
        slot-scope="record"
        style="margin: 0">
        <a-row
          :gutter="24"
          :style="{ marginBottom: '12px' }">
          <a-col :span="12">
            <span>描述：</span>
          </a-col>
          <a-col :span="20" v-if="record.description">
            <a-tag color="cyan">{{ record.description }}</a-tag>
          </a-col>
          <a-col :span="20" v-else>无</a-col>
        </a-row>
      </div>
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="handleDelete(record.id)">删除</a>
      </span>
    </s-table>

    <create-kv-config-modal ref="createKvConfigModal" @ok="handleAddOk"></create-kv-config-modal>
    <edit-kv-config-modal ref="editKvConfigModal" @ok="handleEditOk"></edit-kv-config-modal>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { queryKvConfigByPage, deleteKvConfig } from '@/api/kv-config'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import CreateKvConfigModal from './modules/CreateKvConfigModal'
import EditKvConfigModal from './modules/EditKvConfigModal'

export default {
  name: 'KvConfigList',
  components: {
    CreateKvConfigModal,
    EditKvConfigModal,
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
      // 当前编辑行
      currentEditRecord: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id'
        },
        {
          title: '键编码',
          dataIndex: 'code',
          key: 'code'
        },
        {
          title: '键值',
          dataIndex: 'value',
          key: 'value'
        },
        {
          title: '键名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '键类型',
          dataIndex: 'type',
          key: 'type'
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        parameter.pageIndex = parameter.pageNo
        Object.assign(this.queryParam, parameter)
        return queryKvConfigByPage(this.queryParam)
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
  created () {
  },
  methods: {
    handleEdit (record) {
      this.currentEditRecord = Object.assign({}, record)
      this.$refs.editKvConfigModal.showForm(this.currentEditRecord)
    },
    handleDelete (id) {
      return deleteKvConfig({ id: id })
        .then(res => {
          if (res || res.success || res.data) {
            this.$refs.table.refresh(true)
            this.$message.info('删除配置成功')
          } else {
            this.$message.error('删除配置失败')
          }
        })
    },
    handleAddOk () {
      this.$refs.table.refresh(true)
    },
    handleEditOk () {
      this.$refs.table.refresh(true)
    },
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  }
}
</script>
