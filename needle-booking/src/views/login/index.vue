<template>
  <div class="login-container pull-height" @keyup.enter.native="handleLogin">
    <div class="login-border animated fadeInDown">
      <div class="login-main">
        <h4 class="login-title">{{title}}</h4>
        <userLogin></userLogin>

        <!-- <el-tabs v-model="activeName">
          <el-tab-pane label="用户密码"  name="user">
            <userLogin></userLogin>
          </el-tab-pane>
          <el-tab-pane label="短信验证码" name="code">
            <codeLogin></codeLogin>
          </el-tab-pane>
          <el-tab-pane label="第三方授权登录" name="third">
            <thirdLogin></thirdLogin>
          </el-tab-pane>
        </el-tabs> -->
      </div>
    </div>

  </div>
</template>
<script>
import userLogin from "./userlogin";
import { mapGetters } from "vuex";
import store from '@/store'
import Cookies from 'js-cookie'
import  { getAppInfo } from '@/api/example'
// import { validatenull } from '@/utils/validate'
// import 'vue2-animate/dist/vue2-animate.min.css';

export default {
  name: "login",
  components: {
    userLogin,
  },
  data () {
    return {
      title:  Cookies.get('appname') || '绣花针微框架'
    };
  },
  watch: {
    $route () {}
  },
  created () {
    // if(!this.$route.query.redirect) {
    //   this.getAppInfo()
    // }
  },
  mounted () {},
  computed: {
    ...mapGetters(["appName", "appLogo"])
  },
  props: [],
  methods: {
    // getAppInfo() {
    //   store.dispatch('app/getAppInfo').then(response => {
    //     this.title = this.appName
    //     console.log('login::' + this.appName)
    //   })
    // },
  }
};
</script>

<style lang="scss">
.login-container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: rgba(0, 0, 0, 0.2);
  position: relative;
  height:100%;
}
.login-container::before {
  z-index: -999;
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: url('./img/login.png');
  background-size: cover;
}
.login-info {
  padding-left: 60px;
  display:none;
}
.login-info-title {
  line-height: 90px;
}
.login-info-item {
  font-size: 14px;
}
.login-border {
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 30px 60px 25px 60px;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 1px 1px 2px #eee;
  margin:0 auto;
}
.login-main {
  border-radius: 3px;
  box-sizing: border-box;
  background-color: #fff;
}
.login-main > h3 {
  margin-bottom: 20px;
}
.login-main > p {
  color: #76838f;
}
.login-title {
  margin: 0 0 20px;
  text-align: center;
  color: #409eff;
  letter-spacing: 3px;
}
.login-submit {
  margin-top: 20px;
  width: 100%;
  border-radius: 6px;
  padding: 10px 0;
}
.login-form {
  margin: 10px 0;
  .el-form-item__content {
    width: 280px;
  }
  .el-form-item {
    margin-bottom:16px;
  }
  .el-input {
    input {
      text-indent: 5px;
      border-color: #dcdcdc;
      border-radius: 3px;
    }
    .el-input__prefix {
      i {
        padding: 0 5px;
        font-size: 16px !important;
      }
    }
  }
}
.login-code {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 0 0 0 10px;
}
.login-code-img {
  margin-top: 2px;
  width: 100px;
  height: 32px;
  background-color: #fdfdfd;
  border: 1px solid #dcdcdc;
  color: #333;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 5px;
  line-height: 32px;
  text-indent: 5px;
  text-align: center;
}
</style>