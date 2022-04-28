import NavigationService from '@/utils/navigation'
import { Empty } from '@taroify/core'
import { View } from '@tarojs/components'
import React from 'react'
import './index.less'

function RhLogoutView() {
  return (
    <Empty className='logout-view'>
      <Empty.Description>
        <View className='text text-one'>您还未登录，请您登录后查看～</View>
        <View
          className='text text-two'
          onClick={() => NavigationService.push('/pagesA/login/index')}
        >
          点击此处登录
        </View>
      </Empty.Description>
    </Empty>
  )
}

export default React.memo(RhLogoutView)
