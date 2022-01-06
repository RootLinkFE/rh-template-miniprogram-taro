import { View } from '@tarojs/components'
import React from 'react'
import './index.less'
import RHMButton from '@/components/RHMButton'
import NavigationService from '@/utils/navigation'

class Home extends React.Component {
  constructor(props) {
    super(props)
  }

  handleJump() {
    NavigationService.push('/pagesA/demo/index')
  }

  render() {
    return (
      <View>
        <RHMButton onClick={this.handleJump}>跳转demo页面</RHMButton>
      </View>
    )
  }
}
export default Home
