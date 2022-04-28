import { Input, View } from '@tarojs/components'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { isControlRequired } from '../../utils'
import FormControl from '../control'
import './index.less'

// /**
//  * 文本框参数
//  */
// interface FromTextInputProps extends FormFieldProps<InputProps> {
//   /** 文本替换事件 */
//   replaceEvent?: (value: string) => string;
//   /** 前缀 */
//   prefix?: ReactNode;
//   /** 后缀 */
//   suffix?: ReactNode;
//   /** 对齐方式，默认值：'left' */
//   align?: 'left' | 'right';
//   /** 是否隐藏清空按钮 */
//   hideClear?: boolean;
// }

/**
 * 表单组件：文本输入框
 */
const FormTextInput = (props) => {
  const [value, setValue] = useState('')
  const [focus, setFocus] = useState(false)

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  // 是否必填
  const isRequired = useMemo(
    () => !props.hideRequiredMark && isControlRequired(props?.rules),
    [props?.hideRequiredMark, props?.rules]
  )

  const style = useMemo(
    () => ({
      textAlign: props.align ? props.align : 'left'
    }),
    [props.align]
  )

  /**
   * 更新表单值
   * @param value
   */
  const update = (v) => {
    setValue(v)
    props?.onChange?.(v)
  }

  return (
    <FormControl
      label={props.label}
      required={isRequired}
      labelStyle={props?.labelStyle}
    >
      <View
        className={`${
          props.fieldProps?.disabled ? 'disabled' : ''
        } form-input-control`}
      >
        {props.prefix || null}
        <Input
          style={style}
          value={value}
          focus={focus}
          placeholderClass='form-input-control-placeholder'
          onFocus={() => setFocus(true)}
          onBlur={() => {
            setTimeout(() => setFocus(false), 100)
          }}
          onInput={(e) => {
            let v = e.detail.value
            if (props?.replaceEvent) {
              v = props.replaceEvent?.(e.detail.value)
            }
            update(v)
          }}
          {...props.fieldProps}
        />
        {!props.hideClear && focus && (
          <View
            className='input-clear-action'
            onClick={() => {
              if (!props.fieldProps?.disabled) {
                update('')
              }
            }}
          >
            <View className='clear-icon' />
          </View>
        )}
        {props.suffix || null}
      </View>
    </FormControl>
  )
}
FormTextInput.defaultProps = {
  type: 'FormControl',
  controlName: 'FormTextInput'
}

export default FormTextInput
