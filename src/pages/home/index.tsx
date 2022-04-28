import { View } from '@tarojs/components'
import React from 'react'
import './index.less'
import RhButton from '@/components/RhButton'
import NavigationService from '@/utils/navigation'
import RhTabbar from '@/components/RhTabbar'
import { EventProxy, EventProxyType } from '@/utils/eventProxy'

declare const NEED_CUSTOM_TABBAR: boolean

class Home extends React.Component<any, { currentRoute: string }> {
  constructor(props) {
    super(props)
    this.state = {
      currentRoute: '/pages/home/index',
    }
  }

  handleJump() {
    NavigationService.push('/pagesA/demo/index')
  }

  render() {
    return (
      <View className={NEED_CUSTOM_TABBAR ? 'tarbar-page' : ''}>
        <View className='home-page'>
          <RhButton onClick={this.handleJump}>跳转demo页面</RhButton>
          {NEED_CUSTOM_TABBAR && (
            <RhTabbar route={this.state.currentRoute}></RhTabbar>
          )}
        </View>
      </View>
    )
  }
}
export default Home
