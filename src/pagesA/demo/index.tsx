import RHMButton from '@/components/RHMButton'
import RHMMultipleSelect from '@/components/RHMMultipleSelect'
import { Divider } from '@taroify/core'
import { View } from '@tarojs/components'
import './index.less'
import { regionJSON } from './mock'
import NavigationService from '@/utils/navigation';

const DemoPage = () => {
  const handleJump = () => {
    NavigationService.push('')
  }

  return (
    <>
    <Divider>自定义按钮</Divider>
    <RHMButton className='operate'>
      登录
    </RHMButton>
      <Divider>地址多选</Divider>
      <RHMMultipleSelect
        treeNode={regionJSON}
        nodeOption={{
          labelField: 'name',
          valueField: 'code',
          childrenField: 'children'
        }}
      />
      <Divider>登录页</Divider>
      <RHMButton className='operate' onClick={handleJump}>
        跳转登录页
      </RHMButton>
    </>
  )
}
export default DemoPage
