import Vue from 'vue'
import router from './router'
import store from './store'

import { distinctArray } from '@/utils/collectionUtil'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import notification from 'ant-design-vue/es/notification'
import { ACCESS_TOKEN } from '@/store/mutation-types'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// url白名单
const whiteList = ['login']

router.beforeEach((to, from, next) => {
  NProgress.start()

  const token = Vue.ls.get(ACCESS_TOKEN)
  const hasToken = (token && token !== '')

  if (!hasToken) {
    if (whiteList.includes(to.name)) {
      next()
    } else {
      next({ path: '/user/login', query: { redirect: to.fullPath } })
    }
    return
  }

  /* 拥有token */
  if (!to.path || to.path === '' || to.path === '/' || to.path === '/user/login') {
    next({ path: '/dashboard/workplace' })
    NProgress.done()
    return
  }

  const userInfo = store.getters.userInfo

  if (!userInfo) {
    store.dispatch('UserInfo').then(res => {
      const ret = { success: undefined, data: { resources: [] }, msg: undefined }
      Object.assign(ret, res)
      const permissionCodes = [...ret.data.resources]
      if (!permissionCodes || permissionCodes.length === 0) {
        notification.warn({ message: '告警', description: '您没有任何角色和权限' })
      }
      store.dispatch('GenerateRoutes', distinctArray(permissionCodes)).then(() => {
        // 根据roles权限生成可访问的路由表
        // 动态添加可访问路由表
        router.addRoutes(store.getters.addRouters)
        const redirect = decodeURIComponent(from.query.redirect || to.path)
        if (to.path === redirect) {
          // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          next({ ...to, replace: true })
        } else {
          // 跳转到目的路由
          next({ path: redirect })
        }
      })
    }).catch(rejected => {
      console.log('router.beforeEach,error:', rejected)
      // notification.error({ message: '错误', description: '请求用户信息失败，请重试' })
      store.dispatch('Logout').then(() => {
        next({ path: '/user/login', query: { redirect: to.fullPath } })
      })
    })
  } else {
    next()
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

/**
 * Action 权限指令
 * 指令用法：
 *  - 在需要控制 action 级别权限的组件上使用 v-action:[method] , 如下：
 *    <i-button v-action:add >添加用户</a-button>
 *    <a-button v-action:delete>删除用户</a-button>
 *    <a v-action:edit @click="edit(record)">修改</a>
 *
 *  - 当前用户没有权限时，组件上使用了该指令则会被隐藏
 *  - 当后台权限跟 pro 提供的模式不同时，只需要针对这里的权限过滤进行修改即可
 *
 *  @see https://github.com/sendya/ant-design-pro-vue/pull/53
 */
const action = Vue.directive('action', {
  bind: function (el, binding, vnode) {
    const actionName = binding.arg
    const permissions = store.getters.permissions
    if (!permissions ||
      permissions.length === 0 ||
      !permissions.includes(actionName)) {
      el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
    }
  }
})

export {
  action
}
