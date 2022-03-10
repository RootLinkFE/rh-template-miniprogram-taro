import { Get, Post } from '@/utils/request'

// 用户登录
export const login = (data) =>
  Post('/login-by-wx', { ...data, webType: '' })

// 获取手机验证码
export const getSms = (data) => Get('/sms', data)

// 获取语音验证码
export const getSmsVoice = (data) => Get('/voice', data)
