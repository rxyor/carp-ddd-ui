// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: { title: '仪表盘', keepAlive: true, icon: bxAnaalyse },
        children: [
          {
            path: '/dashboard/analysis',
            name: 'Analysis',
            component: () => import('@/views/dashboard/Analysis'),
            meta: { title: '分析页', keepAlive: false, permission: ['ROLE_ROOT'] }
          },
          // 外部链接
          {
            path: 'https://www.baidu.com/',
            name: 'Monitor',
            meta: { title: '监控页（外部）', target: '_blank' }
          },
          {
            path: '/dashboard/workplace',
            name: 'Workplace',
            component: () => import('@/views/dashboard/Workplace'),
            meta: { title: '工作台', keepAlive: true, permission: ['ROLE_ROOT'] }
          }
        ]
      },
      // 用户中心
      {
        path: '/ums',
        name: 'ums',
        component: PageView,
        meta: { title: '用户权限管理', icon: 'safety', permission: ['ROLE_ROOT'] },
        redirect: '/ums/user',
        children: [
          {
            path: '/ums/user',
            name: 'UmsUser',
            component: RouteView,
            meta: { title: '用户管理', icon: 'user', keepAlive: true },
            redirect: '/ums/user/list',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/ums/user/list',
                name: 'UserList',
                component: () => import('@/views/ums/user/UserList'),
                meta: { title: '编辑用户', icon: 'edit', hidden: true, keepAlive: false }
              },
              {
                path: '/ums/user/edit',
                name: 'UserEdit',
                component: () => import('@/views/ums/user/UserEdit'),
                meta: { title: '编辑用户', icon: 'edit', hidden: true, keepAlive: false }
              },
              {
                path: '/ums/user/add',
                name: 'UserAdd',
                component: () => import('@/views/ums/user/UserAdd'),
                meta: { title: '创建用户', icon: 'add', hidden: true, keepAlive: false }
              },
              {
                path: '/ums/user/roles/edit',
                name: 'UserRolesEdit',
                component: () => import('@/views/ums/user/UserRolesEdit'),
                meta: { title: '分配角色', icon: 'edit', hidden: true, keepAlive: false }
              }
            ]
          },
          {
            path: '/ums/role',
            name: 'UmsRole',
            component: RouteView,
            meta: { title: '角色管理', icon: 'team', keepAlive: true },
            redirect: '/ums/role/list',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/ums/role/list',
                name: 'RoleList',
                component: () => import('@/views/ums/role/RoleList'),
                meta: { title: '角色列表', icon: 'edit', hidden: true, keepAlive: false }
              },
              {
                path: '/ums/role/edit',
                name: 'RoleEdit',
                component: () => import('@/views/ums/role/RoleEdit'),
                meta: { title: '编辑角色', icon: 'edit', hidden: true, keepAlive: false }
              },
              {
                path: '/ums/role/add',
                name: 'RoleAdd',
                component: () => import('@/views/ums/role/RoleAdd'),
                meta: { title: '新建角色', icon: 'edit', hidden: true, keepAlive: false }
              },
              {
                path: '/ums/role/permissions/edit',
                name: 'RolePermissionsEdit',
                component: () => import('@/views/ums/role/RolePermissionsEdit'),
                meta: { title: '分配权限', icon: 'edit', hidden: true, keepAlive: false }
              }
            ]
          },
          {
            path: '/ums/permission',
            name: 'UmsPermission',
            component: RouteView,
            meta: { title: '权限管理', icon: 'team', keepAlive: true },
            redirect: '/ums/permission/list',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/ums/permission/list',
                name: 'PermissionList',
                component: () => import('@/views/ums/permission/PermissionList'),
                meta: { title: '权限列表', icon: 'edit', hidden: true, keepAlive: false }
              },
              {
                path: '/ums/permission/edit',
                name: 'PermissionEdit',
                component: () => import('@/views/ums/permission/PermissionEdit'),
                meta: { title: '编辑权限', icon: 'edit', hidden: true, keepAlive: false }
              },
              {
                path: '/ums/permission/add',
                name: 'PermissionAdd',
                component: () => import('@/views/ums/permission/PermissionAdd'),
                meta: { title: '新建权限', icon: 'edit', hidden: true, keepAlive: false }
              }
            ]
          },
          {
            path: '/ums/Client',
            name: 'UmsClient',
            component: RouteView,
            meta: { title: '客户端管理', icon: 'setting', keepAlive: true },
            redirect: '/ums/client/list',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/ums/client/list',
                name: 'ClientList',
                component: () => import('@/views/ums/clientdetails/ClientList'),
                meta: { title: '客户端列表', icon: 'tool', keepAlive: false }
              },
              {
                path: '/ums/client/edit',
                name: 'ClientEdit',
                component: () => import('@/views/ums/clientdetails/ClientEdit'),
                meta: { title: '编辑客户端', icon: 'tool', keepAlive: true }
              },
              {
                path: '/ums/client/add',
                name: 'ClientAdd',
                component: () => import('@/views/ums/clientdetails/ClientAdd'),
                meta: { title: '新建客户端', icon: 'tool', keepAlive: true }
              }
            ]
          },
          {
            path: '/ums/kv-config',
            name: 'UmsKvConfig',
            component: RouteView,
            meta: { title: '配置管理', icon: 'setting', keepAlive: true },
            redirect: '/ums/kv-config/list',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/ums/kv-config/list',
                name: 'KvConfigList',
                component: () => import('@/views/ums/kvconfig/KvConfigList'),
                meta: { title: '配置列表', icon: 'tool', keepAlive: true }
              },
              {
                path: '/ums/kv-config/edit',
                name: 'KvConfigEdit',
                component: () => import('@/views/ums/kvconfig/KvConfigEdit'),
                meta: { title: '编辑配置', icon: 'tool', keepAlive: false }
              },
              {
                path: '/ums/kv-config/add',
                name: 'KvConfigAdd',
                component: () => import('@/views/ums/kvconfig/KvConfigAdd'),
                meta: { title: '新建配置', icon: 'tool', keepAlive: false }
              }
            ]
          }
        ]
      },

      // forms
      {
        path: '/form',
        redirect: '/form/base-form',
        component: PageView,
        meta: { title: '表单页', icon: 'form', permission: ['form'] },
        children: [
          {
            path: '/form/base-form',
            name: 'BaseForm',
            component: () => import('@/views/form/BasicForm'),
            meta: { title: '基础表单', keepAlive: true, permission: ['form'] }
          },
          {
            path: '/form/step-form',
            name: 'StepForm',
            component: () => import('@/views/form/stepForm/StepForm'),
            meta: { title: '分步表单', keepAlive: true, permission: ['form'] }
          },
          {
            path: '/form/advanced-form',
            name: 'AdvanceForm',
            component: () => import('@/views/form/advancedForm/AdvancedForm'),
            meta: { title: '高级表单', keepAlive: true, permission: ['form'] }
          }
        ]
      },

      // list
      {
        path: '/list',
        name: 'list',
        component: PageView,
        redirect: '/list/table-list',
        meta: { title: '列表页', icon: 'table', permission: ['table'] },
        children: [
          {
            path: '/list/table-list',
            name: 'TableListWrapper',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/list/TableList'),
            meta: { title: '查询表格', keepAlive: true, permission: ['table'] }
          },
          {
            path: '/list/basic-list',
            name: 'BasicList',
            component: () => import('@/views/list/StandardList'),
            meta: { title: '标准列表', keepAlive: true, permission: ['table'] }
          },
          {
            path: '/list/query-list',
            name: 'QueryList',
            component: () => import('@/views/list/QueryList'),
            meta: { title: '查询列表', keepAlive: true, permission: ['table'] }
          },
          {
            path: '/list/card',
            name: 'CardList',
            component: () => import('@/views/list/CardList'),
            meta: { title: '卡片列表', keepAlive: true, permission: ['table'] }
          },
          {
            path: '/list/search',
            name: 'SearchList',
            component: () => import('@/views/list/search/SearchLayout'),
            redirect: '/list/search/article',
            meta: { title: '搜索列表', keepAlive: true, permission: ['table'] },
            children: [
              {
                path: '/list/search/article',
                name: 'SearchArticles',
                component: () => import('../views/list/search/Article'),
                meta: { title: '搜索列表（文章）', permission: ['table'] }
              },
              {
                path: '/list/search/project',
                name: 'SearchProjects',
                component: () => import('../views/list/TableList'),
                meta: { title: '搜索列表（项目）', permission: ['table'] }
              },
              {
                path: '/list/search/application',
                name: 'SearchApplications',
                component: () => import('../views/list/TableList'),
                meta: { title: '搜索列表（应用）', permission: ['table'] }
              }
            ]
          }
        ]
      },

      // profile
      {
        path: '/profile',
        name: 'profile',
        component: RouteView,
        redirect: '/profile/basic',
        meta: { title: '详情页', icon: 'profile', permission: ['profile'] },
        children: [
          {
            path: '/profile/basic',
            name: 'ProfileBasic',
            component: () => import('@/views/profile/basic/Index'),
            meta: { title: '基础详情页', permission: ['profile'] }
          },
          {
            path: '/profile/advanced',
            name: 'ProfileAdvanced',
            component: () => import('@/views/profile/advanced/Advanced'),
            meta: { title: '高级详情页', permission: ['profile'] }
          }
        ]
      },

      // result
      {
        path: '/result',
        name: 'result',
        component: PageView,
        redirect: '/result/success',
        meta: { title: '结果页', icon: 'check-circle-o', permission: ['result'] },
        children: [
          {
            path: '/result/success',
            name: 'ResultSuccess',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
            meta: { title: '成功', keepAlive: false, hiddenHeaderContent: true, permission: ['result'] }
          },
          {
            path: '/result/fail',
            name: 'ResultFail',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),
            meta: { title: '失败', keepAlive: false, hiddenHeaderContent: true, permission: ['result'] }
          }
        ]
      },

      // Exception
      {
        path: '/exception',
        name: 'exception',
        component: RouteView,
        redirect: '/exception/403',
        meta: { title: '异常页', icon: 'warning', permission: ['exception'] },
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
            meta: { title: '403', permission: ['exception'] }
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
            meta: { title: '404', permission: ['exception'] }
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
            meta: { title: '500', permission: ['exception'] }
          }
        ]
      },

      // account
      {
        path: '/account',
        component: RouteView,
        redirect: '/account/center',
        name: 'account',
        meta: { title: '个人页', icon: 'user', keepAlive: true, permission: ['ROLE_ROOT'] },
        children: [
          {
            path: '/account/center',
            name: 'center',
            component: () => import('@/views/account/center/Index'),
            meta: { title: '个人中心', keepAlive: true, permission: ['ROLE_ROOT'] }
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: '个人设置', hideHeader: true, permission: ['ROLE_ROOT'] },
            redirect: '/account/settings/base',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/base',
                name: 'BaseSettings',
                component: () => import('@/views/account/settings/BaseSetting'),
                meta: { title: '基本设置', hidden: true, permission: ['ROLE_ROOT'] }
              },
              {
                path: '/account/settings/security',
                name: 'SecuritySettings',
                component: () => import('@/views/account/settings/Security'),
                meta: { title: '安全设置', hidden: true, keepAlive: true, permission: ['ROLE_ROOT'] }
              },
              {
                path: '/account/settings/custom',
                name: 'CustomSettings',
                component: () => import('@/views/account/settings/Custom'),
                meta: { title: '个性化设置', hidden: true, keepAlive: true, permission: ['ROLE_ROOT'] }
              },
              {
                path: '/account/settings/binding',
                name: 'BindingSettings',
                component: () => import('@/views/account/settings/Binding'),
                meta: { title: '账户绑定', hidden: true, keepAlive: true, permission: ['ROLE_ROOT'] }
              },
              {
                path: '/account/settings/notification',
                name: 'NotificationSettings',
                component: () => import('@/views/account/settings/Notification'),
                meta: { title: '新消息通知', hidden: true, keepAlive: true, permission: ['ROLE_ROOT'] }
              }
            ]
          }
        ]
      },

      // other
      {
        path: '/other',
        name: 'otherPage',
        component: PageView,
        meta: { title: '其他组件', icon: 'slack', permission: ['ROLE_ROOT'] },
        redirect: '/other/icon-selector',
        children: [
          {
            path: '/other/icon-selector',
            name: 'TestIconSelect',
            component: () => import('@/views/other/IconSelectorView'),
            meta: { title: 'IconSelector', icon: 'tool', keepAlive: true, permission: ['ROLE_ROOT'] }
          }
        ]
      }
    ]
  },

  {
    path: '*',
    redirect:
      '/404',
    hidden:
      true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      }
    ]
  },

  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
