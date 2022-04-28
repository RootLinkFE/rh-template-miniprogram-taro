import React from 'react'
import { Input, Textarea, Radio } from '@tarojs/components'
import { getInputFieldProps } from './getInputFieldProps'

const genComponentType = (components) =>
  components.map((c) => React.createElement(c).type)

const InputTypes = genComponentType([Input, Textarea])
// const RadioTypes = genComponentType([Radio])

/**
 * 生成 Field Component Props
 * @param component {props, types}
 */
export function getFieldComponentProps(component) {
  const { props, type } = component
  switch (true) {
    case InputTypes.includes(type):
      return getInputFieldProps(props)
    default:
      return undefined
  }
}
