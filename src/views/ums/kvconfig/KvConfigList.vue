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
            <a-form-item label="键">
              <a-input v-model="queryParam.key" placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="值">
              <a-input v-model="queryParam.value" placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="应用">
              <a-select
                showSearch
                placeholder="请选择"
                name="appId"
                @change="onAppIdChange">
                <a-select-option v-for="(item, index) in appIdList" :key="index" :value="item.value">{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" icon="plus" @click="handleAdd()">新建</a-button>
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
      rowKey="id"
      :columns="columns"
      :data="loadData"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a style="color: red" @click="handleDelete(record.id)">删除</a>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { kvConfigPage, deleteKvConfig } from '@/api/kv-config'
import { appIdOptions } from '@/api/option'
import AFormItem from 'ant-design-vue/es/form/FormItem'

export default {
  name: 'KvConfigList',
  components: {
    AFormItem,
    STable
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      advanced: false,
      // 查询参数
      queryParam: {},
      appIdList: [],
      // 表头
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id'
        },
        {
          title: 'key',
          dataIndex: 'key',
          key: 'key'
        },
        {
          title: 'value',
          dataIndex: 'value',
          key: 'value'
        },
        {
          title: '描述',
          dataIndex: 'desc',
          key: 'desc'
        },
        {
          title: '应用',
          dataIndex: 'appId',
          key: 'appId'
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: param => {
        Object.assign(this.queryParam, { page: param.pageNo, pageSize: param.pageSize })

        return kvConfigPage(this.queryParam).then(res => {
          const source = { success: false, msg: undefined, data: { content: [], totalPages: 1, totalElements: 0, size: 0, number: 0 } }
          Object.assign(source, res)
          if (!source.success) {
            this.$message.error('请求数据失败')
            console.error(res)
          }
          const data = source.data

          const ret = { pageNo: 1, pageSize: 10, totalCount: 0, totalPage: 1, data: [] }
          Object.assign(ret, { pageNo: data.number + 1, pageSize: data.size, totalCount: data.totalElements, totalPage: data.totalPages, data: data.content })
          return ret
        })
      }
    }
  },
  mounted () {
    this.queryAppIdOptions()
  },
  methods: {
    handleAdd () {
      this.$router.push({ name: 'KvConfigAdd' })
    },
    handleEdit (record) {
      this.$router.push({ name: 'KvConfigEdit', query: { id: record.id } })
    },
    handleDelete (id) {
      return deleteKvConfig({ id: id }).then(res => {
        const source = { success: false, msg: undefined, data: [] }
        Object.assign(source, res)
        if (source.success) {
          this.$refs.table.refresh(true)
          this.$message.info('删除配置成功')
        } else {
          this.$message.error('删除配置失败')
        }
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
      this.queryParam.appId = e
    }
  }
}
</script>
