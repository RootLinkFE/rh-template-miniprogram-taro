// import { useCascader } from '@taroify/hooks'
import useCascader from '@/hooks/useCascader'
import { Cascader, Popup } from '@taroify/core'
import { Arrow } from '@taroify/icons'
import { Text, View } from '@tarojs/components'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { flatTreeMap, isControlRequired } from '../../utils'
import FormControl from '../control'
import './index.less'

// interface CascaderColumn {
//   value?: any
//   label?: ReactNode
//   disabled?: boolean
// }

// interface FormCascaderType extends CascaderColumn= {
//   options: FormCascaderType[]
//   isWholeLabel: boolean // 是否显示完整文案
// }

/**
 * 级联组件
 */
const FormCascader = (props) => {
  const { fieldProps, label, header } = props
  const [value, setValue] = useState([])
  const [open, setOpen] = useState(false)
  const [fieldLabel, setFieldLabel] = useState(null)
  const { columns } = useCascader({
    value,
    options: fieldProps.options || []
  })

  const flatColumnsRef = useRef([])
  // const RHMPopupInsRef = useRef()

  // useEffect(() => {
  //   RHMPopupInsRef.current = new RHMPopupService({
  //     id: 'userInfoPage',
  //     content: <View>123</View>
  //   })
  // }, [])

  useEffect(() => {
    if (fieldProps.options.length) {
      flatColumnsRef.current = flatTreeMap(fieldProps.options)
    }
    setValue(props.value || [])
  }, [fieldProps.options])

  useEffect(() => {
    setValue(props.value || [])
    if (!props.value) {
      setFieldLabel(null)
    }
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
    (v, o) => {
      const opts = o.filter(Boolean)
      setValue(v)
      if (!flatColumnsRef.current.get(v[v.length - 1]).children) {
        const showLabel = !!fieldProps?.isWholeLabel
          ? opts
              .filter(Boolean)
              .map(({ children }) => children)
              .join('/')
          : opts[opts.length - 1]['children']

        setOpen(false)
        setFieldLabel(showLabel)
        const options = opts.map((item) => {
          item.label = item.children
          delete item.children
          return item
        })
        props?.onChange?.(v, options)
      }
    },
    [props?.onChange]
  )

  return (
    <FormControl
      label={props.label}
      required={isRequired}
      labelStyle={props?.labelStyle}
      isPopup={true}
    >
      <View className='inner-cascader' onClick={() => setOpen(true)}>
        <Text className={`label ${!fieldLabel ? 'empty' : ''}`}>
          {fieldLabel ||
            props?.placeholder ||
            (fieldProps?.disabled ? '无' : '请选择')}
        </Text>
        {fieldProps?.disabled ? null : (
          <Arrow className='arrow-icon' />
          // <View className='cascader-dropdown'>
          //   <View className='dropdown-icon' />
          // </View>
        )}
      </View>

      <Popup open={open} rounded placement='bottom' onClose={setOpen}>
        <Popup.Close />
        <Cascader
          className='form-cascader'
          value={value}
          // onSelect={setValue}
          onSelect={update}
          // onChange={update}
          {...props.fieldProps}
        >
          <Cascader.Header>{props?.fieldProps?.header}</Cascader.Header>
          {columns.map((column, index) => {
            return (
              <Cascader.Tab key={index}>
                {column.map((o) => (
                  <Cascader.Option key={o.value} value={o.value}>
                    {o.label}
                  </Cascader.Option>
                ))}
              </Cascader.Tab>
            )
          })}
        </Cascader>
      </Popup>
    </FormControl>
  )
}
FormCascader.defaultProps = {
  type: 'FormControl',
  controlName: 'FormCascader'
}
export default FormCascader
