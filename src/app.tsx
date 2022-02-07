import React from 'react'
import { Provider } from 'react-redux'
import './app.less'
import Config from './config/index'
import models from './models'
import { isWeapp } from './utils'
import dva from './utils/dva'
import SystemPower from './utils/system'

const dvaApp = dva.createApp({
  initialState: {},
  models: models
})
const store = dvaApp.getStore()

// do initial
Config.start && Config.start({}, dvaApp)

export default class App extends React.Component {
  constructor() {
    super({}, {})
  }

  componentDidMount() {
    if (isWeapp()) {
      SystemPower.update()
    }
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // this.props.children 是将要会渲染的页面
  render() {
    return <Provider store={store}>{this.props.children}</Provider>
  }
}
