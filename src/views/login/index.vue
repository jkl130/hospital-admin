
<style scoped lang="scss">
  @import "./index.scss";
</style>
<template>
  <el-form class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" v-show="loginState">
      <h3 class="title">医院挂号系统管理后台</h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="用户名" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
          placeholder="密码"></el-input>
          <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
          登 录
        </el-button>
      </el-form-item>
      <!-- <span class="registerBtn" @click="loginState = false">管理员登录</span> -->
    </el-form>
    <el-form class="register-form" :model="adminForm" ref="adminForm" v-show="!loginState">
      <h3 class="title">管理员登录</h3>
      <el-form-item style="color: #fff;padding-left: 8px;">
        <input type="file" placeholder="请上传秘钥">
      </el-form-item>
      <section style="display: flex;justify-content: space-between">
        <el-button style="width:100%;margin-bottom: 22px;" type="primary" @click.native.prevent="adminLogin">登 录</el-button>
      </section>
      <span class="registerBtn" @click="loginState = true">用户登录</span>
    </el-form>
  </el-form>
</template>

<script type="es6">
import {mapGetters} from 'vuex'
export default {
  name: 'login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      adminForm: {
        // 密码
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }]
      },
      loading: false,
      pwdType: 'password',
      loginState: true
    }
  },
  computed: {
    ...mapGetters(['adminToken'])
  },
  methods: {
    adminLogin() {
      const files = document.querySelector('input[type=file]').files
      if (!files.length) {
        this.$message({ type: 'error', message: '请上传用于身份认证的文件' })
        return
      }
      let reader = new FileReader();
      let token = ''
      reader.readAsText(files[0])
      reader.onload = () => {
        try {
          token = this.decompress(reader.result)
        } catch (error) {
          token = reader.result
        }
        if (token) {
          const notificationList = localStorage.getItem('notificationList')
          if (!notificationList) {
            localStorage.setItem('notificationList', JSON.stringify([]))
          }
          localStorage.userType = 'admin'
          localStorage.token = token
          this.$router.push('/')
          this.$router.go(0)
        }
      }
    },
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false;
            localStorage.siteNav = '';
            this.$router.push({ path: '/' })
            this.$router.go(0)
          }).catch(() => {
            this.loading = false;
          })
        }
      })
    }
  }
}
</script>
