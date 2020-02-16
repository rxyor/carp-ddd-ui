<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="客户端ID">
              <a-input v-model="queryParam.clientId" placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="权限">
                <a-input v-model="queryParam.authority" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="授权类型">
                <a-input v-model="queryParam.authorizedGrantType" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="访问范围">
                <a-input v-model="queryParam.scope" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="资源ID">
                <a-input v-model="queryParam.resourceId" placeholder="请输入"/>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" icon="plus" @click="$refs.createClientModal.showForm()">新建</a-button>
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
      rowKey="clientId"
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
            <a-col :lg="8" :md="24">
              <span>授权类型：</span>
            </a-col>
            <a-col :lg="20" :md="24" v-if="record.authorizedGrantTypeList.length > 0">
              <a-tag color="cyan" v-for="(grantType, k) in record.authorizedGrantTypeList" :key="k">{{ grantType }}</a-tag>
            </a-col>
            <a-col :span="20" v-else>-</a-col>
          </a-col>
          <a-col :span="12">
            <a-col :lg="8" :md="24">
              <span>资源ID：</span>
            </a-col>
            <a-col :lg="20" :md="24" v-if="record.resourceIdList.length > 0">
              <a-tag color="cyan" v-for="(resourceId, k) in record.resourceIdList" :key="k">{{ resourceId }}</a-tag>
            </a-col>
            <a-col :span="20" v-else>-</a-col>
          </a-col>
          <a-col :span="12">
            <a-col :lg="8" :md="24">
              <span>访问范围：</span>
            </a-col>
            <a-col :lg="20" :md="24" v-if="record.scopeList.length > 0">
              <a-tag color="cyan" v-for="(scope, k) in record.scopeList" :key="k">{{ scope }}</a-tag>
            </a-col>
            <a-col :span="20" v-else>-</a-col>
          </a-col>
          <a-col :span="12">
            <a-col :lg="8" :md="24">
              <span>权限：</span>
            </a-col>
            <a-col :lg="20" :md="24" v-if="record.authorityList.length > 0">
              <a-tag color="cyan" v-for="(authority, k) in record.authorityList" :key="k">{{ authority }}</a-tag>
            </a-col>
            <a-col :span="20" v-else>-</a-col>
          </a-col>
          <a-col :span="12">
            <a-col :lg="8" :md="24">
              <span>跳转URL：</span>
            </a-col>
            <a-col :lg="20" :md="24" v-if="record.webServerRedirectUri">
              <a-tag color="cyan">{{ record.webServerRedirectUri }}</a-tag>
            </a-col>
            <a-col :span="20" v-else>-</a-col>
          </a-col>
        </a-row>
      </div>
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="handleDelete(record.clientId)">删除</a>
      </span>
    </s-table>

    <create-client-modal ref="createClientModal" @ok="handleAddOk"></create-client-modal>
    <edit-client-modal ref="editClientDetailModal" @ok="handleEditOk" @assignRoleOk="handleEditOk"></edit-client-modal>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { queryClientDetailByPage, deleteClientDetail } from '@/api/client'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import CreateClientModal from './modules/CreateClientModal'
import EditClientModal from './modules/EditClientModal'

export default {
  name: 'ClientList',
  components: {
    CreateClientModal,
    EditClientModal,
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
      transfer: {
        allRoles: [
        ],
        targetKeys: []
      },
      // 当前编辑Client
      currentEditRecord: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '客户端ID',
          dataIndex: 'clientId',
          key: 'clientId'
        },
        {
          title: '客户端密码',
          dataIndex: 'clientSecret',
          key: 'clientSecret'
        },
        {
          title: '令牌时效',
          dataIndex: 'accessTokenValidity',
          key: 'accessTokenValidity',
          customRender: (text) => {
            if (text) {
              return text + '秒'
            } else {
              return '不限'
            }
          }
        },
        {
          title: '刷新令牌时效',
          dataIndex: 'refreshTokenValidity',
          key: 'refreshTokenValidity',
          customRender: (text) => {
            if (text) {
              return text + '秒'
            } else {
              return '不限'
            }
          }
        },
        {
          title: '授权码验证方式',
          dataIndex: 'autoapprove',
          key: 'autoapprove'
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
        return queryClientDetailByPage(this.queryParam)
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
      this.$refs.editClientDetailModal.showForm(this.currentEditRecord)
    },
    handleDelete (id) {
      return deleteClientDetail({ clientId: id })
        .then(res => {
          if (res || res.success || res.data) {
            this.$refs.table.refresh(true)
            this.$message.info('删除Client成功')
          } else {
            this.$message.error('删除Client失败')
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
