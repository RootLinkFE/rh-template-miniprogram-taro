import RHMTabbar from '@/components/RHMTabbar'
import { View } from '@tarojs/components'
import React from 'react'

declare const NEED_CUSTOM_TABBAR: boolean

class Mine extends React.Component<any, { currentRoute: string }> {
  constructor(props) {
    super(props)
    this.state = {
      currentRoute: '/pages/mine/index'
    }
  }

  render() {
    return (
      <View className={NEED_CUSTOM_TABBAR ? 'tarbar-page' : ''}>
        <View className='mine-page'>
          我的页面
          {NEED_CUSTOM_TABBAR && (
            <RHMTabbar route={this.state.currentRoute}></RHMTabbar>
          )}
        </View>
      </View>
    )
  }
}
export default Mine
