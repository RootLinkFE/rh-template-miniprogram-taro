import { Get, Post } from '@/utils/request'

// 用户登录
export const login = (data) =>
  Post('/iam/v1/user/login-by-wx', { ...data, webType: 'ROBOT_APPLETS' })

// 获取手机验证码
export const getSms = (data) => Get('/common/sms', data)

// 获取语音验证码
export const getSmsVoice = (data) => Get('/common/voice', data)
