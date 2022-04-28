import { View } from '@tarojs/components'
import { Switch } from '@taroify/core'
import React, { Component } from 'react'
import { isControlRequired } from '../../utils'
import FormControl from '../control'
import './index.less'

/**
 * 开关组件
 */
class FormSwitch extends Component {
  static defaultProps = {
    type: 'FormControl',
    controlName: 'FormSwitch'
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.value || false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps?.value) {
      this.setState({ value: nextProps?.value || false })
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
    this.setState({ value })
    this.props?.onChange?.(value)
  }

  render() {
    return (
      <FormControl
        label={this.props.label}
        required={this.isRequired}
        labelStyle={this.props?.labelStyle}
      >
        <View className='form-switch-control'>
          <Switch
            checked={this.state.value}
            onChange={(value) => this.update(value)}
            size='24'
            className='switch-color'
            {...this.props.fieldProps}
          />
        </View>
      </FormControl>
    )
  }
}

export default FormSwitch
