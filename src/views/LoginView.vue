<script setup>
import Cookies from 'js-cookie'
import { SM4Util } from 'sm4util'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { setAccessToken, setRefreshToken } from '@/utils/storage'
import { useWPDStore } from '@/stores/wpd'
import { useSystemStore } from '@/stores/system'
import { captcha_image, oauth_token } from '@/api/login'
import { system_user_info } from '@/api/user'

const router = useRouter()
const WPDStore = useWPDStore()
const userProjectId = WPDStore.userProjectId
const systemStore = useSystemStore()
const setUserInfo = systemStore.setUserInfo
const captcha = ref({
  code: '',
  img: '',
  realKey: ''
})
const loginFrom = ref({
  username: '',
  password: '',
  captcha: '',
  rememberMe: false
})
const verifyRules = ref({
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 4, max: 4, message: '长度为 4 个字符', trigger: 'blur' }
  ]
})
const loginLoading = ref(false)
const loginBtnText = ref('登录')

onMounted(() => {
  getCaptchaImage()
  getRememberMe()
})

const getRememberMe = () => {
  const username = Cookies.get('username')
  const password = Cookies.get('password')
  if (username && password) {
    loginFrom.value.username = username
    loginFrom.value.password = atob(password)
    loginFrom.value.rememberMe = true
  }
}

const getCaptchaImage = async () => {
  const captchaImageRes = await captcha_image()
  if (captchaImageRes.code === 0) {
    captcha.value.code = captchaImageRes.data.code
    captcha.value.img = `data:image/png;base64,${captchaImageRes.data.img}`
    captcha.value.realKey = captchaImageRes.data.realKey
  }
}

const handleClickLoginBtn = async () => {
  // 验证验证码
  if (loginFrom.value.captcha.toLowerCase() !== captcha.value.code.toLowerCase()) {
    ElMessage.error('验证码错误')
    loginFrom.value.captcha = ''
    await getCaptchaImage()
    return
  }

  // loading
  loginLoading.value = true
  loginBtnText.value = '登录中...'

  // 记住密码
  if (loginFrom.value.rememberMe) {
    Cookies.set('username', loginFrom.value.username)
    Cookies.set('password', btoa(loginFrom.value.password))
  } else {
    Cookies.remove('username')
    Cookies.remove('password')
  }

  // 获取token
  const sm4 = new SM4Util()
  const oauthTokenRes = await oauth_token({
    username: `${loginFrom.value.username}:${userProjectId}`,
    password_type: 'SM4',
    password: sm4.encryptCustom_CBC(
      loginFrom.value.password,
      '0bcefb5f5e7b26c2',
      'b898a41422ab319c'
    ),
    code: loginFrom.value.captcha,
    realKey: captcha.value.realKey,
    grant_type: 'password',
    scope: 'server'
  })
  // console.log('oauthTokenRes', oauthTokenRes)
  if (oauthTokenRes.dept_id) {
    const access_token = oauthTokenRes.access_token
    const refresh_token = oauthTokenRes.refresh_token

    setAccessToken(access_token)
    setRefreshToken(refresh_token)

    // 获取用户信息
    await getSystemUserInfo()
    router.push({ path: '/baseInfo' }).catch((err) => err)
  } else {
    ElMessage.error('账号密码错误或验证码失效')
    await getCaptchaImage()
    loginFrom.value.captcha = ''
  }

  loginLoading.value = false
  loginBtnText.value = '登录'
}

const getSystemUserInfo = async () => {
  const userInfoRes = await system_user_info()
  if (userInfoRes.code === 0) {
    setUserInfo(userInfoRes.data)
  }
}
</script>

<template>
  <div class="w-100% h-100% pos-relative">
    <el-card
      class="pos-absolute w-400px top-200px"
      style="margin: 100px auto; left: calc(50% - 200px)"
    >
      <template #header>
        <div class="flex-ac text-20px" style="padding: 0 75px">
          <span>登</span>
          <span>录</span>
        </div>
      </template>
      <el-form status-icon :model="loginFrom" :rules="verifyRules">
        <el-form-item prop="username">
          <el-input v-model="loginFrom.username" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginFrom.password"
            placeholder="请输入密码"
            type="password"
            autocomplete="off"
            show-password
          />
        </el-form-item>
        <el-form-item prop="captcha">
          <el-input
            v-model="loginFrom.captcha"
            style="width: 200px"
            placeholder="请输入验证码"
            autocomplete="off"
          />
          <img
            class="h-40px ml-25px cursor-pointer"
            style="width: calc(100% - 225px); border-radius: 4px"
            alt="验证码"
            :src="captcha.img"
            @click="getCaptchaImage"
          />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="loginFrom.rememberMe">记住密码</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button
            class="w-100%"
            type="primary"
            v-loading="loginLoading"
            @click="handleClickLoginBtn"
          >
            {{ loginBtnText }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
