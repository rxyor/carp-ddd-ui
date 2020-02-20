<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="ID">
              <a-input v-model="query.id" placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="权限">
                <a-input v-model="query.authority" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="授权类型">
                <a-input v-model="query.authorizedGrantType" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="访问范围">
                <a-input v-model="query.scope" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="资源ID">
                <a-input v-model="query.resourceId" placeholder="请输入"/>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" icon="plus" @click="handleAdd()">新建</a-button>
              <a-button
                style="margin-left: 8px"
                type="primary"
                icon="search"
                @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => query = {}">重置</a-button>
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
            <a-col :lg="8" :md="24">
              <span>授权类型：</span>
            </a-col>
            <a-col :lg="20" :md="24" v-if="record.authorizedGrantTypeList.length > 0">
              <a-tag color="cyan" v-for="(grantType, k) in record.authorizedGrantTypeList" :key="k">{{
                grantType }}
              </a-tag>
            </a-col>
            <a-col :span="20" v-else>-</a-col>
          </a-col>
          <a-col :span="12">
            <a-col :lg="8" :md="24">
              <span>资源ID：</span>
            </a-col>
            <a-col :lg="20" :md="24" v-if="record.resourceIdList.length > 0">
              <a-tag color="cyan" v-for="(resourceId, k) in record.resourceIdList" :key="k">{{ resourceId
              }}
              </a-tag>
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
              <a-tag color="cyan" v-for="(authority, k) in record.authorityList" :key="k">{{ authority
              }}
              </a-tag>
            </a-col>
            <a-col :span="20" v-else>-</a-col>
          </a-col>
          <a-col :span="12">
            <a-col :lg="8" :md="24">
              <span>跳转URL：</span>
            </a-col>
            <a-col :lg="20" :md="24" v-if="record.webServerRedirectUriList">
              <a-tag color="cyan" v-for="(uri, k) in record.webServerRedirectUriList" :key="k">{{ uri }}
              </a-tag>
            </a-col>
            <a-col :span="20" v-else>-</a-col>
          </a-col>
        </a-row>
      </div>
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical"/>
        <a style="color: red" @click="handleDelete(record.id)">删除</a>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { clientPage, deleteClient } from '@/api/client'
import { appIdOptions } from '@/api/option'
import AFormItem from 'ant-design-vue/es/form/FormItem'

export default {
  name: 'ClientList',
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
      query: {},
      // 表头
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id'
        },
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
              const days = parseInt(text / 86400)
              const hours = parseInt((text % 86400) / 3600)
              const seconds = (text % 3600)
              let s = ''
              if (days > 0) {
                s += days + '天'
              }
              if (hours > 0) {
                s += hours + '小时'
              }
              if (seconds > 0) {
                s += seconds + '秒'
              }
              return s
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
              const days = parseInt(text / 86400)
              const hours = parseInt((text % 86400) / 3600)
              const seconds = (text % 3600)
              let s = ''
              if (days > 0) {
                s += days + '天'
              }
              if (hours > 0) {
                s += hours + '小时'
              }
              if (seconds > 0) {
                s += seconds + '秒'
              }
              return s
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
      loadData: param => {
        Object.assign(this.query, { page: param.pageNo, pageSize: param.pageSize })

        return clientPage(this.query).then(res => {
          const source = {
            success: false,
            msg: undefined,
            data: { content: [], totalPages: 1, totalElements: 0, size: 0, number: 0 }
          }
          Object.assign(source, res)
          if (!source.success) {
            this.$message.error('请求数据失败')
            console.error(res)
          }
          const data = source.data

          const ret = { pageNo: 1, pageSize: 10, totalCount: 0, totalPage: 1, data: [] }
          Object.assign(ret, {
            pageNo: data.number + 1,
            pageSize: data.size,
            totalCount: data.totalElements,
            totalPage: data.totalPages,
            data: data.content
          })
          return ret
        })
      }
    }
  },
  methods: {
    handleAdd () {
      this.$router.push({ name: 'ClientAdd' })
    },
    handleEdit (record) {
      this.$router.push({ name: 'ClientEdit', query: { id: record.id } })
    },
    handleDelete (id) {
      return deleteClient({ id: id }).then(res => {
        const source = { success: false, msg: undefined, data: [] }
        Object.assign(source, res)
        if (source.success) {
          this.$refs.table.refresh(true)
          this.$message.info('删除成功')
        } else {
          this.$message.error('删除失败')
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
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  }
}
</script>
