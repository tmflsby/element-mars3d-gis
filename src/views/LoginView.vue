<script setup>
import Cookies from 'js-cookie'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { ref, reactive, onBeforeMount, onMounted } from 'vue'
import { captcha_image, oauth_token, oauth_check_token } from '@/api/login'
import { setAccessToken, setRefreshToken } from '@/utils/token'
import { useWPDStore } from '@/stores/wpd'

const router = useRouter()
const WPDStore = useWPDStore()
const userProjectId = WPDStore.userProjectId
const captcha = reactive({
  code: '',
  img: '',
  realKey: ''
})
const loginFrom = reactive({
  username: '',
  password: '',
  captcha: '',
  rememberMe: false
})
const verifyRules = reactive({
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (!/^\w+$/.test(value)) {
          callback(new Error('账号为英文、数字、下划线组成'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 4, max: 4, message: '长度为 4 个字符', trigger: 'blur' }
  ]
})
const loginLoading = ref(false)
const loginBtnText = ref('登录')

onBeforeMount(() => {
  keydownEnterLogin()
  getCaptchaImage()
})
onMounted(() => {
  getRememberMe()
})

const keydownEnterLogin = () => {
  window.onkeydown = (e) => {
    if (e.keyCode === 13) {
      handleClickLoginBtn()
    }
  }
}

const getRememberMe = () => {
  const username = Cookies.get('username')
  const password = Cookies.get('password')
  if (username && password) {
    loginFrom.username = username
    loginFrom.password = window.atob(password)
    loginFrom.rememberMe = true
  }
}

const getCaptchaImage = async () => {
  const captchaImageRes = await captcha_image()
  if (captchaImageRes.code === 0) {
    captcha.code = captchaImageRes.data.code
    captcha.img = `data:image/png;base64,${captchaImageRes.data.img}`
    captcha.realKey = captchaImageRes.data.realKey
  }
}

const handleClickLoginBtn = async () => {
  // 验证验证码
  if (loginFrom.captcha.toLowerCase() !== captcha.code.toLowerCase()) {
    ElMessage.error('验证码错误')
    await getCaptchaImage()
    return
  }

  // loading
  loginLoading.value = true
  loginBtnText.value = '登录中...'

  // 记住密码
  if (loginFrom.rememberMe) {
    Cookies.set('username', loginFrom.username)
    Cookies.set('password', window.btoa(loginFrom.password))
  } else {
    Cookies.remove('username')
    Cookies.remove('password')
  }

  // 获取token
  const oauthTokenRes = await oauth_token({
    username: `${loginFrom.username}:${userProjectId}`,
    password: loginFrom.password,
    code: loginFrom.captcha,
    realKey: captcha.realKey,
    grant_type: 'password',
    scope: 'server'
  })
  // console.log('oauthTokenRes', oauthTokenRes)
  if (oauthTokenRes.dept_id) {
    const access_token = oauthTokenRes.access_token
    const refresh_token = oauthTokenRes.refresh_token

    // 验证token
    const oauthCheckTokenRes = await oauth_check_token({
      token: access_token
    })
    // console.log('oauthCheckTokenRes', oauthCheckTokenRes)
    if (oauthCheckTokenRes.user_id) {
      setAccessToken(access_token)
      setRefreshToken(refresh_token)
      await router.push({ path: '/baseInfo' })
    } else {
      ElMessage.error('token验证失败')
      await getCaptchaImage()
    }
  } else {
    ElMessage.error('账号或密码错误')
    await getCaptchaImage()
  }

  loginLoading.value = false
  loginBtnText.value = '登录'
}
</script>

<template>
  <div class="login">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>登</span>
          <span>录</span>
        </div>
      </template>
      <el-form status-icon :model="loginFrom" :rules="verifyRules">
        <el-form-item prop="username">
          <el-input
            v-model="loginFrom.username"
            placeholder="请输入账号"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginFrom.password"
            placeholder="请输入密码"
            type="password"
            autocomplete="off"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="captcha">
          <el-input
            v-model="loginFrom.captcha"
            class="captcha"
            placeholder="请输入验证码"
            autocomplete="off"
          ></el-input>
          <img class="captcha-image" :src="captcha.img" alt="" @click="getCaptchaImage" />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="loginFrom.rememberMe">记住密码</el-checkbox>
        </el-form-item>
        <el-button
          class="login-btn"
          type="primary"
          v-loading="loginLoading"
          @click="handleClickLoginBtn"
        >
          {{ loginBtnText }}
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.login {
  width: 100%;
  height: 100%;
  position: relative;
  .box-card {
    position: absolute;
    top: 200px;
    left: calc(50% - 200px);
    width: 400px;
    margin: 100px auto;
    .card-header {
      padding: 0 75px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      font-size: 20px;
    }
    .captcha {
      width: 200px;
    }
    .captcha-image {
      width: calc(100% - 225px);
      height: 40px;
      margin-left: 25px;
      border-radius: 4px;
      cursor: pointer;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>
