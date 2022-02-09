import { View } from '@tarojs/components'
import React from 'react'
import './index.less'
import RHMButton from '@/components/RHMButton'
import NavigationService from '@/utils/navigation'
import RHMTabbar from '@/components/RHMTabbar'
import { EventProxy, EventProxyType } from '@/utils/eventProxy'

declare const NEED_CUSTOM_TABBAR: boolean

class Home extends React.Component<any, { currentRoute: string }> {
  constructor(props) {
    super(props)
    this.state = {
      currentRoute: '/pages/home/index'
    }
  }

  handleJump() {
    NavigationService.push('/pagesA/demo/index')
  }

  render() {
    return (
      <View>
        <RHMButton onClick={this.handleJump}>跳转demo页面</RHMButton>
        {NEED_CUSTOM_TABBAR && <RHMTabbar route={this.state.currentRoute}></RHMTabbar>}
      </View>
    )
  }
}
export default Home
