import Taro from '@tarojs/taro'
import RhButton from '@/components/RhButton'
import RhMultipleSelect from '@/components/RhMultipleSelect'
import { Divider } from '@taroify/core'
import { View } from '@tarojs/components'
import './index.less'
import { regionJSON } from './mock'
import NavigationService from '@/utils/navigation'
import {
  FormCascader,
  FormTextarea,
  FormUpload,
  RhForm,
} from '@/components/RhForm'
import { useCallback, useRef, useState, useEffect } from 'react'

const DemoPage = () => {
  const formRef = useRef<any>(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [options, setOptions] = useState([])

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const deviceOpts = []
        setOptions(deviceOpts)
      } catch (error) {}
    }
    fetchDevice()
  }, [])

  const handleJump = useCallback(() => {
    NavigationService.push('')
  }, [])

  const handleSubmit = useCallback(async () => {
    try {
      await formRef.current.validate()
      setSubmitLoading(true)
      setTimeout(() => {
        const formData = formRef.current.getFieldsValue()
        console.log(formData)
        setSubmitLoading(false)
      }, 2000)
    } catch (error) {}
  }, [])

  return (
    <>
      <Divider>Form表单</Divider>
      <View className='demo-form'>
        <RhForm ref={formRef}>
          <FormCascader
            label='设备品类'
            fieldProps={{
              name: 'categorys',
              options,
              header: '请选择设备品类',
            }}
            rules={{ required: true, message: '请选择设备品类' }}
          />
          <FormUpload
            label='上传设备操作证'
            fieldProps={{
              name: 'certificate',
              multiple: true,
              tips:
                '图片格式为jpg、png和gif，文件大小不得超过5M，否则将无法上传',
            }}
            rules={{ required: true, message: '请上传设备操作证' }}
            vertical={true}
          />
          <FormTextarea
            label='技术说明'
            fieldProps={{
              name: 'techMsg',
              placeholder: '请输入',
              maxlength: 200,
            }}
          />
        </RhForm>
        <RhButton
          className='demo-submit'
          onClick={handleSubmit}
          loading={submitLoading}
        >
          表单提交
        </RhButton>
      </View>
      <Divider>自定义按钮</Divider>
      <RhButton className='operate'>登录</RhButton>
      <Divider>地址多选</Divider>
      <RhMultipleSelect
        treeNode={regionJSON}
        nodeOption={{
          labelField: 'name',
          valueField: 'code',
          childrenField: 'children',
        }}
      />
      <Divider>登录页</Divider>
      <RhButton className='operate' onClick={handleJump}>
        跳转登录页
      </RhButton>
    </>
  )
}
export default DemoPage
