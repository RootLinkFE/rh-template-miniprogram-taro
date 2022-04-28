/*
 * @Author: LinYing
 * @Date: 2022-01-24 17:54:43
 * @Description: 表单-日期选择器
 */

import { getFormatTime } from '@/utils/common'
import { DatetimePicker, Input, Picker, Popup } from '@taroify/core'
import { ArrowRight } from '@taroify/icons'
import { View } from '@tarojs/components'
import { useEffect, useMemo, useState } from 'react'
import { isControlRequired } from '../../utils'
import FormControl from '../control'
import './index.less'

const FormDatePicker = (props) => {
  const [value, setValue] = useState(null)
  const [open, setOpen] = useState(false)
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
    <>
      <FormControl
        label={props.label}
        required={isRequired}
        labelStyle={props?.labelStyle}
        className={props.className || ''}
      >
        <View
          className={`${
            props.fieldProps?.disabled ? 'disabled' : ''
          } form-input-control`}
          onClick={() => setOpen(true)}
        >
          <Input
            style={style}
            value={getFormatTime(value, props.formatType)}
            readonly
            placeholder={props.placeholder}
            placeholderClass='form-input-control-placeholder'
            onClick={() => setOpen(true)}
            {...props.fieldProps}
          />
          {props?.disabled ? null : <ArrowRight className='arrow-icon' />}
        </View>
      </FormControl>

      <Popup
        mountOnEnter={false}
        style={{ height: '50%' }}
        open={open}
        rounded
        placement='bottom'
        onClose={setOpen}
      >
        <DatetimePicker
          type={props.formatType}
          onCancel={() => setOpen(false)}
          onConfirm={(newValue) => {
            console.log('confirm', newValue)
            update(newValue)
            setOpen(false)
          }}
        >
          <Picker.Toolbar>
            <Picker.Button type='cancel'>取消</Picker.Button>
            <Picker.Button type='confirm'>确认</Picker.Button>
          </Picker.Toolbar>
        </DatetimePicker>
      </Popup>
    </>
  )
}

FormDatePicker.defaultProps = {
  type: 'FormControl',
  controlName: 'FormDatePicker',
  formatType: 'date'
}

export default FormDatePicker
