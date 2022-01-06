import { Textarea, View } from '@tarojs/components'
import React, { Component } from 'react'
import { isControlRequired } from '../../utils'
import FormControl from '../control'
import './index.less'

/**
 * 多行文本输入框组件
 */
class FormTextArea extends Component {
  static defaultProps = {
    type: 'FormControl',
    controlName: 'FormTextArea'
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.value || ''
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps?.value) {
      this.setState({ value: nextProps?.value || '' })
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
        className={this.props?.className}
      >
        <View className='form-textarea-control'>
          <Textarea
            value={this.state.value}
            onInput={(e) => this.update(e.detail.value)}
            showConfirmBar={false}
            cursorSpacing={120}
            placeholderClass='form-textarea-control-placeholder'
            autoHeight
            {...this.props.fieldProps}
          />
        </View>
      </FormControl>
    )
  }
}

export default FormTextArea
