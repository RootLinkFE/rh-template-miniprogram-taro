import React from 'react'
import { View } from '@tarojs/components'
import { PropTypes } from 'prop-types'

function RhDriver({ gapNum = 10 }) {
  return <View style={{ marginBottom: `${gapNum}px` }}></View>
}

export default RhDriver

RhDriver.prototype = {
  gapNum: PropTypes.number,
}
