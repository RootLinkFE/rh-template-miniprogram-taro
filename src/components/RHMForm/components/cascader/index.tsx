// import { useCascader } from '@taroify/hooks'
import useCascader from '@/hooks/useCascader'
import { refactorTree } from '@/utils/common'
import { Cascader, Popup } from '@taroify/core'
import type { CascaderProps } from '@taroify/core/cascader/cascader'
import { ArrowRight } from '@taroify/icons'
import { Text, View } from '@tarojs/components'
import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { flatTreeMap, isControlRequired } from '../../utils'
import FormControl, { FormControlProps } from '../control'
import './index.less'

interface CascaderColumn {
  value: any
  label: ReactNode
  disabled: boolean
}

type CascaderFieldProps = {
  name: string
  header?: ReactNode | string
  disabled?: boolean
  isWholeLabel?: boolean // 是否显示完整文案
  options: Partial<CascaderColumn>[],
  optionsProps?: {
    labelField?: string // 转换后的label字段 默认 label
    valueField?: string // 转换后的value字段 默认 value
    childrenField?: string // 转换后的子集名 默认 children
    currLabel?: string // 转换前的label字段 默认 name
    currValue?: string // 转换前的value字段 默认 id
    currchildren?: string // 转换前的子集名 默认 subNode
  }
}

interface FormCascaderType extends FormControlProps {
  fieldProps: CascaderFieldProps & CascaderProps
  type?: 'FormControl',
  controlName?: 'FormCascader'
}

/**
 * 级联组件
 */
const FormCascader: React.FC<FormCascaderType> = (props) => {
  const { fieldProps } = props
  const [value, setValue] = useState([])
  const [open, setOpen] = useState(false)
  const [fieldLabel, setFieldLabel] = useState(null)
  const refactorOptions = useMemo(() => refactorTree(fieldProps.options || [], fieldProps.optionsProps || {}), [fieldProps.options])
  const { columns } = useCascader({
    value,
    options: refactorOptions
  })

  const flatColumnsRef = useRef<any>([])
  // const RHMPopupInsRef = useRef()

  // useEffect(() => {
  //   RHMPopupInsRef.current = new RHMPopupService({
  //     id: 'userInfoPage',
  //     content: <View>123</View>
  //   })
  // }, [])

  useEffect(() => {
    if (fieldProps.options?.length) {
      flatColumnsRef.current = flatTreeMap(refactorOptions)
    }
    setValue(props.value || []);
  }, [fieldProps.options]);

  useEffect(() => {
    setValue(props.value || []);
    if (!props.value) {
      setFieldLabel(null);
    }
  }, [props.value]);

  // 是否必选
  const isRequired = useMemo(
    () => isControlRequired(props?.rules),
    [props?.rules]
  )

  /**
   * 更新表单值
   * @param value
   */
  const update = useCallback(
    (v, o) => {
      const opts = o.filter(Boolean);
      setValue(v);
      if (!flatColumnsRef.current.get(v[v.length - 1]).children) {
        const showLabel = !!fieldProps?.isWholeLabel
          ? opts
              .filter(Boolean)
              .map(({ children }) => children)
              .join("/")
          : opts[opts.length - 1]["children"];

        setOpen(false);
        setFieldLabel(showLabel);
        const options = opts.map((item) => {
          item.label = item.children;
          delete item.children;
          return item;
        });
        props?.onChange?.(v, options);
      }
    },
    [props?.onChange]
  );

  return (
    <>
      <FormControl
        label={props.label}
        required={isRequired}
        labelStyle={props?.labelStyle}
        isPopup={true}
        {...props}
      >
        <View className="inner-cascader" onClick={() => setOpen(true)}>
          <Text className={`label ${!fieldLabel ? "empty" : ""}`}>
            {fieldLabel ||
              props?.fieldProps?.placeholder ||
              (fieldProps?.disabled ? '无' : '请选择')}
          </Text>
          {fieldProps?.disabled ? null : (
            <ArrowRight className="arrow-icon" />
          )}
        </View>
      </FormControl>
      <Popup open={open} rounded placement="bottom" onClose={setOpen}>
      <Popup.Close />
      <Cascader
        className="form-cascader"
        value={value}
        // onSelect={setValue}
        onSelect={update}
        // onChange={update}
        {...props.fieldProps}
      >
        <Cascader.Header>{props?.fieldProps?.header}</Cascader.Header>
          {columns.map((column: any[], index) => {
            return (
              <Cascader.Tab key={index}>
                {column?.map((o) => (
                  <Cascader.Option key={o.value} value={o.value}>
                    {o.label}
                  </Cascader.Option>
                ))}
              </Cascader.Tab>
            );
          })}
        </Cascader>
      </Popup>
    </>
  );
};
FormCascader.defaultProps = {
  type: "FormControl",
  controlName: "FormCascader",
};
export default FormCascader;
