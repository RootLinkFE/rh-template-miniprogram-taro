import RhUpload from '@/components/RhUpload'
import { View } from '@tarojs/components'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { isControlRequired } from '../../utils'
import FormControl from '../control'
import './index.less'

const FormUpload = (props) => {
  const [value, setValue] = useState()

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  // 是否必填
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
      {...props}
    >
      <View className='form-upload-control'>
        <RhUpload value={value} onChange={update} {...props.fieldProps} />
      </View>
    </FormControl>
  )
}
FormUpload.defaultProps = {
  type: 'FormControl',
  controlName: 'FormUpload',
}

export default FormUpload
