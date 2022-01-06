import React, { CSSProperties, FC, ReactNode } from 'react'
import { Text, View } from '@tarojs/components'
import './index.less'

// /**
//  * 表单项参数
//  */
// interface FormControlProps {
//   /** 表单项标签 */
//   label?: string;
//   /** 表单标签宽度 */
//   labelStyle?: CSSProperties;
//   /** 是否必填 */
//   required?: boolean;
//   /** 表单项控件，传入表单控件组件 */
//   children?: ReactNode;
//   /** 是否垂直显示 */
//   vertical?: boolean;
//   /** 兼容有弹窗 */
//   isPopup?: boolean;
// }

/**
 * 表单项组件
 */
const FormControl = (props) => {
  return (
    <View
      className={`form-control ${props?.vertical ? 'vertical' : ''} ${
        props?.isPopup ? 'has-popup' : ''
      } ${props?.className || ''}`}
      hoverClass='form-control-hover'
    >
      {props?.label && (
        <View className='label' style={props?.labelStyle}>
          {props?.required && <Text className='required'>*</Text>}
          <Text>{props?.label}</Text>
        </View>
      )}
      <View className={`${props?.disabled ? 'content-disabled' : ''} control`}>{props?.children}</View>
    </View>
  )
}

export default FormControl
