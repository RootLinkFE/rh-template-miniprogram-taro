import { View } from '@tarojs/components'
import { forwardRef } from 'react'

function TaroPopoverComponent(props) {
  const { state = {} } = props

  const { visible = false, pw, ph, px, py, vertical, align } = state
  return (
    <View>
      {visible && (
        <View
          className={`popover-view ${vertical} ${align}`}
          style={`width:${pw}px;height:${ph}px;left:${px}px;top:${py}px;`}
        >
          {props.children}
        </View>
      )}
    </View>
  )
}

export default TaroPopoverComponent
