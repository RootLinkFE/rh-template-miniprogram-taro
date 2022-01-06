import VCodeLoginForm from '@/services/login/vcodeLoginFrom'
import NavigationService from '@/utils/navigation'
import { Checkbox, Image, Text, View } from '@tarojs/components'
import { useEffect, useState, useCallback } from 'react'
import './index.less'
import { DEFAULT_AVATAR } from '../../config/const'

export default function LoginPage() {
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    autoLogin()
  }, [])

  // 微信静默登录
  function autoLogin() {
    NavigationService.dispatch('loginModel/login', {
      loginMethod: 'wechat_app'
    })
  }

  const handleJump = useCallback((who) => {
    const url =
      who === 'protocol' ? '/mini-protocol.html' : '/mini-protocol.html'
    NavigationService.push('/pagesA/webView/agreement', { url })
  }, [])

  return (
    <View className='login-page'>
      <View className='login-page-header'>
        <Image className='login-page-header-logo' src={DEFAULT_AVATAR} />
      </View>

      <View className='login-page-body'>
        <VCodeLoginForm btnProps={{ disabled: !checked }} />
        <View className='agreement'>
          <Checkbox
            style='transform: scale(0.7); position: relative; top: -1px'
            color='#D92500'
            checked={checked}
            onClick={() => setChecked(!checked)}
          ></Checkbox>
          <View>
            登录即代表同意《小嘿机租用户
            <View className='text-bold' onClick={() => handleJump('protocol')}>
              服务协议
            </View>
            {/* 及
            <View className='text-bold' onClick={() => handleJump('policy')}>
              隐私政策
            </View> */}
            》
          </View>
        </View>
      </View>
    </View>
  )
}
