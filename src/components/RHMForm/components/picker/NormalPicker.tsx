import { isNil } from '@/utils/mylodash'
import { Arrow } from '@taroify/icons'
import { Picker, Text, View } from '@tarojs/components'
import React, { Component } from 'react'
import { isArrayEqual, isControlRequired } from '../../utils'
import FormControl from '../control'
import './index.less'

// /**
//  * 滚动选择器参数定义
//  */
// export interface NormalPickerProps extends FormFieldProps<PickerMultiSelectorProps | PickerTimeProps | PickerDateProps | PickerRegionProps | PickerSelectorProps> {
//   /** 占位符 */
//   placeholder?: string;
//   /** 多列选择器的分隔符 */
//   separator?: string
//   /** Picker 变化事件 */
//   onPickerChange?: (e) => void;
// }

/**
 * 滚动选择器组件
 */
class NormalPicker extends Component {
  static defaultProps = {
    type: 'FormControl',
    controlName: 'NormalPicker'
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props?.value || null
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.value !== nextProps?.value ||
      (Array.isArray(nextProps.value) &&
        !isArrayEqual(this.props.value, nextProps.value))
    ) {
      const { range, valueField } = this.props.fieldProps
      const index = range.findIndex((b) => b[valueField] === nextProps?.value)
      this.setState({ value: index === -1 ? null : index })
    }
  }

  // 是否必填
  isRequired =
    !this.props.hideRequiredMark && isControlRequired(this.props?.rules)

  /**
   * 更新表单值
   * @param value
   */
  update(value) {
    const { range, valueField } = this.props.fieldProps
    this.setState({ value })
    // this.props?.onPickerChange?.(range[value][valueField])
    this.props?.onChange?.(range[value][valueField], range[value])
  }

  render() {
    let label,
      fieldProps = { ...this.props.fieldProps }
    const rangeKey = fieldProps?.rangeKey
    const isValueNullOrUndefined = isNil(this.state.value)
    switch (fieldProps?.mode) {
      case 'selector':
        const curr1 = !isValueNullOrUndefined
          ? fieldProps?.range?.[this.state.value]
          : null
        label = rangeKey ? curr1?.[rangeKey] : curr1
        break
      case 'multiSelector':
        if (fieldProps?.isRegion) {
          const {
            multiIndex,
            addressMulti,
            onColumnchange,
            onSelect,
            onCancel,
            name,
            disabled,
            labelText
          } = this.props
          label = name
          fieldProps = {
            value: multiIndex,
            range: addressMulti,
            onColumnchange: onColumnchange,
            disabled: disabled,
            onCancel: onCancel,
            onChange: (e) => {
              onSelect(e.detail.value)
              this.update(e.detail.value)
            },
            ...fieldProps
          }
        } else {
          label =
            !isValueNullOrUndefined && Array.isArray(this.state.value)
              ? this.state.value
                  .map((item, i) => {
                    const curr2 = fieldProps?.range?.[i]?.[item]
                    return rangeKey ? curr2?.[rangeKey] : curr2
                  })
                  .join(this.props?.separator || '')
              : null
        }
        break
      default:
        break
    }
    return (
      <FormControl
        label={this.props.label}
        required={this.isRequired}
        labelStyle={this.props?.labelStyle}
      >
        <View className='form-picker-control'>
          <Picker
            className='picker'
            value={this.state.value}
            onChange={(e) => this.update(e.detail.value)}
            {...fieldProps}
          >
            <View className='inner-picker'>
              <Text className={`label ${!label ? 'empty' : ''}`}>
                {label ||
                  this.props?.placeholder ||
                  (fieldProps?.disabled ? '无' : '请选择')}
              </Text>
              {fieldProps?.disabled ? null : (
                <Arrow className='arrow-icon' />
                // <View className='picker-dropdown'>
                //   <View className='dropdown-icon' />
                // </View>
              )}
            </View>
          </Picker>
        </View>
      </FormControl>
    )
  }
}

export default NormalPicker
