import { Label, Text, View } from '@tarojs/components'
import { Radio } from '@taroify/core'
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { isControlRequired } from '../../utils'
import FormControl from '../control'
import '../../styles/checkbox.less'

/**
 * 单选框参数
 */
// export interface FormRadioGroupProps extends FormFieldProps<RadioGroupProps> {
//   /** 选中值 */
//   value?: number | string;
//   /** 选项列表 */
//   options: { label: string; option: RadioProps }[];
//   /** 排列方式：'vertical'-垂直排列、'horizontal'-水平排列，默认：水平 */
//   layout?: 'vertical' | 'horizontal';
// }

/**
 * 单选框组件
 */
const FormRadioGroup = (props) => {
  const [value, setValue] = useState(null)

  useEffect(() => {
    setValue(props.value || null)
  }, [props.value])

  // 是否必选
  const isRequired = useMemo(
    () => !props.hideRequiredMark && isControlRequired(props?.rules),
    [props?.hideRequiredMark, props?.rules]
  )

  /**
   * 更新表单值
   * @param value
   */
  const update = useCallback(
    (v) => {
      console.log(v)
      setValue(v)
      props?.onChange?.(v)
    },
    [props?.onChange]
  )

  return (
    <FormControl
      label={props.label}
      required={isRequired}
      labelStyle={props?.labelStyle}
    >
      <Radio.Group
        className='form-radio-group'
        onChange={(v) => update(v)}
        value={value}
        {...props.fieldProps}
      >
        <View
          className={`form-radio-group-control ${props?.layout ||
            'horizontal'}`}
        >
          {props.options &&
            props.options.map((item, index) => {
              const key = index + ''
              return (
                <Label for={key} key={key}>
                  <Radio
                    {...item.option}
                    key={item.option.value}
                    name={item.option.value}
                  >
                    <Text>{item.label}</Text>
                  </Radio>
                </Label>
              )
            })}
        </View>
      </Radio.Group>
    </FormControl>
  )
}
FormRadioGroup.defaultProps = {
  type: 'FormControl',
  controlName: 'FormRadioGroup'
}
export default FormRadioGroup
