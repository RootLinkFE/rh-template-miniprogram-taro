import avatarImg from '@/assets/images/avatar.svg'
import avatarFrameImg from '@/assets/images/avatarFrame.svg'
import RhTabbar from '@/components/RhTabbar'
import { Button } from '@taroify/core'
import { Image, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { inject, observer } from 'mobx-react'
import { useEffect, useState } from 'react'
import './index.less'

declare var NEED_CUSTOM_TABBAR: boolean
interface MyInfoProps {
  store: {
    mineStore: {
      isLogin: boolean
      handleIsLogin: (isLogin: boolean) => void
    }
  }
}

type userInfo = {
  avatarUrl: string
  nickName: string
}

const MyInfo: React.FC<MyInfoProps> = (props) => {
  const isLogin = props?.store?.mineStore.isLogin
  const handleIsLogin = props?.store?.mineStore.handleIsLogin

  const [userInfo, setUserInfo] = useState<userInfo>({
    avatarUrl: '',
    nickName: '',
  })

  useEffect(() => {
    const userInfo = Taro.getStorageSync('userInfo')
    if (userInfo) {
      setUserInfo(userInfo)
      handleIsLogin(true)
    } else {
      handleIsLogin(false)
    }
  }, [])

  const handleLogin = () => {
    Taro.getUserProfile({
      desc: '用于登录小程序',
      success: (res) => {
        Taro.showToast({
          title: '登录成功！',
          icon: 'success',
          duration: 2000,
          success: () => {
            setTimeout(() => {
              Taro.setStorage({
                key: 'userInfo',
                data: res.userInfo,
              })
              setUserInfo(res.userInfo)
              handleIsLogin(true)
            }, 2000)
          },
        })
      },
      fail: () =>
        Taro.showToast({
          title: '登录失败',
          icon: 'error',
          duration: 2000,
        }),
    })
  }

  const handleLogOut = () => {
    Taro.removeStorage({
      key: 'userInfo',
      success: () => {
        handleIsLogin(false)
        setUserInfo({
          avatarUrl: '',
          nickName: '',
        })
      },
    })
  }

  return (
    <View className={NEED_CUSTOM_TABBAR ? 'tarbar-page' : ''}>
      <View className='mine-page'>
        <view className='myInfoBg'>
          <view className='myInfoBox'>
            <Image src={avatarFrameImg} className='avatarFrame' />
            <Image src={userInfo.avatarUrl || avatarImg} className='avatar' />
            <text
              className='loginText'
              onClick={() => !isLogin && handleLogin()}
            >
              {userInfo.nickName || '点击登录'}
            </text>
          </view>
          {isLogin && (
            <Button
              block
              onClick={() => handleLogOut()}
              className='myInfoLogOut'
            >
              退出登录
            </Button>
          )}
        </view>
        <RhTabbar route={'/pages/mine/index'}></RhTabbar>
      </View>
    </View>
  )
}

export default inject('store')(observer(MyInfo))
