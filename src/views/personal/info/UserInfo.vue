<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-row :gutter="24">
      <a-col :md="24" :lg="7">
        <a-card :bordered="false" style="height: 100%">
          <div class="account-center-avatarHolder">
            <a-avatar class="avatar" style="color: #000000; background-color: #5fb8fd" :size="100" :src="avatar()">
              <b style="font-size: 30px;color: white">  {{ user.simpleName }}</b>
            </a-avatar>
            <div class="username">{{ nickname() }}</div>
            <div class="bio">
              <p style="color: #ff734c;font-style: italic">{{ bio }}</p>
            </div>
          </div>
          <div class="account-center-detail">
            <p>
              <a-icon class="title" type="user"></a-icon>
              {{ user.username }}
            </p>
            <p>
              <a-icon class="title" type="phone"></a-icon>
              {{ user.phone }}
            </p>
            <p>
              <a-icon class="title" type="mail"></a-icon>
              {{ user.email }}
            </p>
          </div>
        </a-card>
        <a-divider :dashed="true"/>
      </a-col>
      <a-col :md="24" :lg="17">
        <a-card style="width:100%" :bordered="false">
          <div class="account-center-tags">
            <div class="tagsTitle" style="font-size: large">角色</div>
            <div>
              <template v-for="(role ,index) in user.roleList">
                <a-tag v-if="index<showRoleNumber" color="green" :key="role.value" :closable="false">
                  <b style="color:gray">{{ role.desc }}</b>
                </a-tag>
                <a-tag
                  v-if="index===showRoleNumber"
                  color="red"
                  :key="role.value"
                  :closable="false"
                  @click="showAllRole">
                  <b style="color:gray">{{ user.roleList.length -100 }}个未显示角色...</b>
                </a-tag>
              </template>
            </div>
          </div>
        </a-card>
        <a-divider :dashed="true"/>
        <a-card style="width:100%" :bordered="false">
          <div class="account-center-tags">
            <div class="tagsTitle" style="font-size: large">权限</div>
            <div>
              <template v-for="(p,index) in user.permissionList">
                <a-tag v-if="index<showPermissionNumber" color="green" :key="p.value" :closable="false">
                  <b style="color:gray">{{ p.desc }}</b>
                </a-tag>
                <a-tag
                  v-if="index===showPermissionNumber"
                  color="red"
                  :key="p.code"
                  :closable="false"
                  @click="showAllResource">
                  <b style="color:gray">{{ user.permissionList.length -100 }}个未显示资源...</b>
                </a-tag>
              </template>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { PageView, RouteView } from '@/layouts'

import { mapGetters } from 'vuex'

const poet = [
  '有谁不曾为那暗恋而痛苦?我们总以为那份痴情很重，很重，是世上最重的重量。有一天，暮然回首，我们才发现，它一直都是很轻，很轻的。我们以为爱的很深，很深，来日岁月，会让你知道，它不过很浅，很浅。最深和最重的爱，必须和时日一起成长',
  '明日复明日，明日何其多',
  '水光潋滟晴方好，山色空蒙雨亦奇',
  '但愿人长久，千里共婵娟',
  '希望是美好的，也许是人间至善，而美好的事物永不消逝',
  '开拓视野，冲破艰险，看见世界，身临其境，贴近彼此，感受生活，这就是生活的目的',
  '人生和电影不一样，人生辛苦多了',
  '有些人浅薄，有些人金玉其外而败絮其中。可不经意间，有一天你会遇到一个彩虹般绚丽的人，从此以后，其他人就不过是匆匆浮云',
  '岁月匆匆，而今我爱上了许多女人，当他们紧紧拥抱我的时候，都会问我是否会挂记着她们，我想当时我的回答是，是的。但是，我唯一没有忘记的，却是从来没有问过我的那个人',
  '我是小妖怪，逍遥又自在，杀人不眨眼，吃人不放盐，一口七八个，肚子要撑破',
  '别人的看法都是狗屁，你是谁只有你自己说了才算，这是爹教我的道理'
]
export default {
  components: {
    RouteView,
    PageView
  },
  data () {
    return {
      showRoleNumber: 100,
      showPermissionNumber: 100,
      bio: 1,
      user: {
        id: undefined,
        shopCode: undefined,
        nickname: undefined,
        simpleName: undefined,
        email: undefined,
        username: undefined,
        phone: undefined,
        roleList: [],
        permissionList: []
      }
    }
  },
  mounted () {
    this.getUserInfo()
    const poetIndex = Math.floor(Math.random() * (poet.length - 1))
    this.bio = poet[poetIndex]
  },
  methods: {
    ...mapGetters(['nickname', 'avatar', 'userInfo']),
    showAllRole () {
      this.showRoleNumber = this.roleList.length
    },
    showAllResource () {
      this.showPermissionNumber = this.resourceList.length
    },
    getUserInfo () {
      const storeUser = this.userInfo()
      Object.assign(this.user, storeUser)
      if (this.user.roleList) {
        const len = this.user.roleList.length
        for (let i = 0; i < len; i++) {
          const role = this.user.roleList[i]
          let desc
          if (role && role.label) {
            desc = role.value + '(' + role.label + ')'
          } else {
            desc = role.value + '(无角色名)'
          }
          Object.assign(this.user.roleList[i], { desc: desc })
        }
      }
      if (this.user.permissionList) {
        const len = this.user.permissionList.length
        for (let i = 0; i < len; i++) {
          const resource = this.user.permissionList[i]
          let desc
          if (resource && resource.label) {
            desc = resource.value + '(' + resource.label + ')'
          } else {
            desc = resource.value + '(无资源名)'
          }
          Object.assign(this.user.permissionList[i], { desc: desc })
        }
      }
      if (this.user.nickname) {
        const len = this.user.nickname.length
        if (len >= 2) {
          this.user.simpleName = this.user.nickname.substr(len - 2, len)
        } else {
          this.user.simpleName = this.user.nickname.substr(len - 1, len)
        }
      }
    },

    handleTabChange (key, type) {
      this[type] = key
    },

    handleTagClose (removeTag) {
      const tags = this.tags.filter(tag => tag !== removeTag)
      this.tags = tags
    },

    showTagInput () {
      this.tagInputVisible = true
      this.$nextTick(() => {
        this.$refs.tagInput.focus()
      })
    },

    handleInputChange (e) {
      this.tagInputValue = e.target.value
    },

    handleTagInputConfirm () {
      const inputValue = this.tagInputValue
      let tags = this.tags
      if (inputValue && !tags.includes(inputValue)) {
        tags = [...tags, inputValue]
      }

      Object.assign(this, {
        tags,
        tagInputVisible: false,
        tagInputValue: ''
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .page-header-wrapper-grid-content-main {
    width: 100%;
    height: 100%;
    min-height: 100%;
    transition: 0.3s;

    .account-center-avatarHolder {
      text-align: center;
      margin-bottom: 24px;

      & > .avatar {
        margin: 0 auto;
        width: 104px;
        height: 104px;
        margin-bottom: 20px;
        border-radius: 50%;
        overflow: hidden;

        img {
          height: 100%;
          width: 100%;
        }
      }

      .username {
        color: rgba(0, 0, 0, 0.85);
        font-size: 20px;
        line-height: 28px;
        font-weight: 500;
        margin-bottom: 4px;
      }
    }

    .account-center-detail {
      p {
        margin-bottom: 8px;
        padding-left: 26px;
        position: relative;
      }

      i {
        position: absolute;
        height: 14px;
        width: 14px;
        left: 0;
        top: 4px;
      }
    }

    .account-center-tags {
      .ant-tag {
        margin-bottom: 8px;
      }
    }

    .account-center-team {
      .members {
        a {
          display: block;
          margin: 12px 0;
          line-height: 24px;
          height: 24px;

          .member {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.65);
            line-height: 24px;
            max-width: 100px;
            vertical-align: top;
            margin-left: 12px;
            transition: all 0.3s;
            display: inline-block;
          }

          &:hover {
            span {
              color: #1890ff;
            }
          }
        }
      }
    }

    .tagsTitle,
    .teamTitle {
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      margin-bottom: 12px;
    }
  }
</style>
