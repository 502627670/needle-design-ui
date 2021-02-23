<template>
  <div>
    <div class="navbar">
      <hamburger
        id="hamburger-container"
        :is-active="sidebar.opened"
        class="hamburger-container"
        @toggleClick="toggleSideBar"
      />

      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

      <div class="right-menu">
        <template v-if="device !== 'mobile'">
          <search id="header-search" class="right-menu-item" />

          <!-- <error-log class="errLog-container right-menu-item hover-effect" /> -->

          <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->

          <!-- <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->

          <div class="right-menu-item hover-effect message-container">
            <el-dropdown trigger="click" class="message-dropdown" :key="msgPanelKey">
              <el-badge v-if="total > 0" :value="total" class="item">
                <i class="el-icon-bell" />
              </el-badge>
              <el-badge v-else class="item">
                <i class="el-icon-bell" />
              </el-badge>
              <el-dropdown-menu slot="dropdown">
                <div class="dropdown-header text-center" style="min-width:140px;">
                  <strong>{{total}}个新消息通知</strong>
                </div>
                <router-link v-for="(msg,index) in messageList" :to="'/message?id=' + msg.id" 
                  :key="'_msg_notice_' + index">
                  <el-dropdown-item @click.native="handleRefreshMessage" style="padding: 3px 15px;">
                    <i class="el-icon-chat-dot-square" />
                    {{msg.title}}
                  </el-dropdown-item>
                </router-link>
                <router-link to="/message">
                  <el-dropdown-item divided>
                    <i class="el-icon-chat-dot-square" />
                    查看更多
                  </el-dropdown-item>
                </router-link>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>

        <el-dropdown
          class="avatar-container right-menu-item hover-effect"
          trigger="click">
          <div class="avatar-wrapper">
            <img class="user-avatar" :src="getUserProfile()" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item style="min-width:140px;">
              <i class="el-icon-user" />
              {{ username }}
            </el-dropdown-item>
            <!-- <router-link to="/profile/index">
              <el-dropdown-item style="min-width:140px;">
                <i class="el-icon-user" />
                {{ username }}
              </el-dropdown-item>
            </router-link> -->
            <!-- <router-link to="/task">
              <el-dropdown-item divided style="min-width:140px;">
                <i class="el-icon-date" />
                我的任务
              </el-dropdown-item>
            </router-link> -->
            <router-link to="/profile/index">
              <el-dropdown-item>
                <i class="el-icon-message" />
                消息中心
              </el-dropdown-item>
            </router-link>
            <router-link to="/">
              <el-dropdown-item>
                <i class="el-icon-s-platform" />
                返回首页
              </el-dropdown-item>
            </router-link>
            <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
            <el-dropdown-item divided @click.native="logout">
              <span style="display: block">
                <img :src="logoutIcon" style="width:12px;margin-right:7px;" />
                注销登录
              </span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <span
          class="right-menu-item menu-setting hover-effect"
          @click="$emit('setting')">
          <i class="el-icon-setting" />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import Breadcrumb from "@/components/Breadcrumb"
import Hamburger from "@/components/Hamburger"
import ErrorLog from "@/components/ErrorLog"
import Screenfull from "@/components/Screenfull"
import SizeSelect from "@/components/SizeSelect"
import Search from "@/components/HeaderSearch"
import logoutIcon from "@/assets/images/logout.png"
import defaultProfile from "@/assets/images/default-profile.png"
import Settings from "./Settings"
import  { findList } from '@/api/example'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search,
    Settings,
  },
  data() {
    return {
      logoutIcon: logoutIcon,
      total: 0,
      messageList: [],
      msgPanelKey: 0,
    };
  },
  created() {
    this.findMessages()
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "username", "device"]),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    getUserProfile() {
      return this.avatar ? this.avatar : defaultProfile;
    },
    async logout() {
      this.$store.dispatch("app/getAppInfo");
      
      this.$confirm("确认要注销当前登录吗？", "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
          await this.$store.dispatch("user/logout");
          this.$router.push(`/login?redirect=${this.$route.fullPath}`);
        }).catch((err) => {
          console.error(err);
        });
    },
    findMessages() {
      let params = { messageStatus: 'UNREAD' }
      findList('message', params).then(response => {
        this.messageList = response.data.content
        this.total = response.data.totalElements
        this.msgPanelKey++
        setTimeout(() => {
          this.loading = false
        }, 200)
      })
    },
    handleRefreshMessage() {
      this.findMessages()
    }
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 60px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 56px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 60px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          // background: rgba(0, 0, 0, .025)
          background: #e6f7ff !important;
        }
      }
    }
    .message-container {
      padding: 0 15px;

      .el-badge__content.is-fixed {
        top: 10px !important;
      }

      .el-icon-bell {
        font-size: 18px;
      }
    }

    .avatar-container {
      margin-right: 0px;
      .avatar-wrapper {
        margin-top: 7px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 32px;
          height: 32px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }

    .menu-setting {
      padding: 0 10px;
      font-size: 24px;
    }
  }
}
.el-popper[x-placement^="bottom"] {
  margin-top: 1px;
}
</style>
<style>
.message-container .el-badge__content.is-fixed {
  top: 10px !important;
}
</style>
