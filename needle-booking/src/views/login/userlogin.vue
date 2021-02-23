<template>
  <el-form class="login-form" status-icon 
    :rules="loginRules" ref="loginForm" :model="loginForm" label-width="0">
    <el-form-item prop="username" style="margin-bottom:18px;">
      <el-input @keyup.enter.native="handleLogin"
        v-model="loginForm.username"  size="small"
        auto-complete="off" placeholder="请输入用户名">
        <i slot="prefix" class="el-icon-user-solid"></i>
      </el-input>
    </el-form-item>

    <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
      <el-form-item prop="password" style="margin-bottom:18px;">
        <el-input size="small"
          @keyup.native="checkCapslock"
          @blur="capsTooltip = false"
          @keyup.enter.native="handleLogin"
          :type="passwordType"
          v-model="loginForm.password"
          auto-complete="off"
          placeholder="请输入密码">
          <i class="el-icon-view el-input__icon" slot="suffix" @click="showPassword"></i>
          <i slot="prefix" class="el-icon-key"></i>
        </el-input>
      </el-form-item>
    </el-tooltip>

    <el-form-item prop="code" style="display:none;">
      <el-row :span="24">
        <el-col :span="14">
          <el-input size="small" keyup.enter.native="handleLogin" :maxlength="code.len"
            v-model="loginForm.code" auto-complete="off" placeholder="请输入验证码">
            <i slot="prefix" class="el-icon-unlock"></i>
          </el-input>
        </el-col>
        <el-col :span="10">
          <div class="login-code">
            <span class="login-code-img" @click="refreshCode" v-if="code.type == 'text'">
              {{code.value}}
            </span>
            <img :src="code.src" class="login-code-img" @click="refreshCode" v-else />
            <i class="icon-shuaxin login-code-icon" @click="refreshCode"></i>
          </div>
        </el-col>
      </el-row>
    </el-form-item>
    
    <el-checkbox v-model="loginForm.rememberMe">记住账号</el-checkbox>

    <el-form-item>
      <el-button type="primary" :loading="loading" size="small"
        @click.native.prevent="handleLogin" class="login-submit">
        登录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { isvalidUsername } from "@/utils/validate";
import { randomLenNum } from "@/utils/util";
import { mapGetters } from "vuex";
import Cookies from 'js-cookie'
import store from '@/store'

export default {
  name: "userlogin",
  data () {
    const validateUsername = (rule, value, callback) => {
      if(!value) {
        callback(new Error("请输入用户名"));
      }
      // else if (!isvalidUsername(value)) {
      //   callback(new Error("请输入正确的用户名"));
      // } 
      else {
        callback();
      }
    };
    const validateCode = (rule, value, callback) => {
      if (this.code.value != value) {
        this.loginForm.code = "";
        this.refreshCode();
        callback(new Error("请输入正确的验证码"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      redirect: this.$route.query.redirect,
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        redomStr: ""
      },
      code: {
        src: "",
        value: "",
        len: 4,
        type: "text"
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码长度最少为6位字符", trigger: "blur" }
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 4, max: 4, message: "验证码长度为4位", trigger: "blur" },
          { required: true, trigger: "blur", validator: validateCode }
        ]
      },
      passwordType: "password",
      capsTooltip: false,
    };
  },
  created () {
    this.refreshCode()
    if(!this.$route.query.redirect) {
      this.getAppInfo()
    }
  },
  mounted () { },
  computed: {
    ...mapGetters(["appName", "appLogo"])
  },
  props: [],
  methods: {
    refreshCode () {
      this.loginForm.redomStr = randomLenNum(this.code.len, true);
      this.code.type == "text"
        ? (this.code.value = randomLenNum(this.code.len))
        : (this.code.src = `${this.codeUrl}/${this.loginForm.redomStr}`);
      this.loginForm.code = this.code.value;
    },
    getAppInfo() {
      store.dispatch('app/getAppInfo').then(response => {
        console.log('login::' + this.appName)
      })
    },
    showPassword () {
      this.passwordType == ""
        ? (this.passwordType = "password")
        : (this.passwordType = "");
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
          })
          .catch((error) => { this.loading = false })
        } 
        else {
          this.$message({ type: 'error', message: '请检查输入项' });
          return false
        }
      })
    },
  }
};
</script>

<style>
.el-form-item.is-success .el-input__validateIcon {
    color: #67c23a;
}
.login-form .el-input .el-input__prefix i {
  padding: 0 5px;
  font-size: 16px !important;
  margin-top: 5px;
  vertical-align: middle;
}
</style>
