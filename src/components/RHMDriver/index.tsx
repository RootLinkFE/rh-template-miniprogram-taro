import React from 'react'
import { View } from '@tarojs/components'
import { PropTypes } from 'prop-types'

function RHMDriver({ gapNum = 10 }) {
  return <View style={{ marginBottom: `${gapNum}px` }}></View>
}

export default RHMDriver

RHMDriver.prototype = {
  gapNum: PropTypes.number
}
