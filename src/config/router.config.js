// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/personal',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: { title: '仪表盘', keepAlive: true, icon: bxAnaalyse, permission: ['ROLE_ROOT'] },
        children: [
          {
            path: '/dashboard/workplace',
            name: 'Analysis',
            component: () => import('@/views/dashboard/Analysis'),
            meta: { title: '分析页', keepAlive: false, permission: ['ROLE_ROOT'] }
          }
        ]
      },
      {
        path: '/personal',
        component: RouteView,
        redirect: '/personal/info',
        name: 'Personal',
        meta: { title: '个人中心', icon: 'user', keepAlive: true },
        children: [
          {
            path: '/personal/info',
            name: 'PersonalInfo',
            component: () => import('@/views/personal/info/UserInfo'),
            meta: { title: '个人信息', keepAlive: true }
          },
          {
            path: '/personal/setting',
            name: 'PersonalSetting',
            component: () => import('@/views/personal/settings/Index'),
            meta: { title: '个人配置', keepAlive: true },
            redirect: '/personal/settings/custom',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/personal/settings/custom',
                name: 'PersonalCustomSettings',
                component: () => import('@/views/personal/settings/Custom'),
                meta: { title: '个性化设置', hidden: true, keepAlive: true }
              }
            ]
          }
        ]
      },
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
