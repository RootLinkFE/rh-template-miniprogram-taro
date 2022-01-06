import RHMButton from '@/components/RHMButton'
import RHMMobileVerifyCode from '@/components/RHMMobileVerifyCode/index'
import { useVisible } from '@/hooks/handle'
import { isNotEmpty } from '@/utils/common'
import { get } from '@/utils/mylodash'
import NavigationService from '@/utils/navigation'
import GlobalToast from '@/utils/toast'
import { Field, Button } from '@taroify/core'
import { View, Text } from '@tarojs/components'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useSelector } from 'react-redux'

VCodeLoginForm.propTypes = {
  onlyWxMobile: PropTypes.bool, // 是否显示手机验证码表单
  btnProps: PropTypes.object // 提交按钮属性
}

export default function VCodeLoginForm(props) {
  const [mobile, setMobile] = useState()
  const [verifyCode, setVerifyCode] = useState()
  const { visible, toggle } = useVisible(true)
  // const rootStore = useSelector((state) => state.loginModel)

  const { onlyWxMobile = false, btnProps = {} } = props

  const handleSubmit = () => {
    NavigationService.dispatch('loginModel/login', {
      loginMethod: 'mobile_vcode',
      mobile,
      verifyCode
    })
  }

  const handleSendCodeSuccess = (resp) => {
    const txt = get(resp, 'toast.text', '')
    const theCode = get(txt.match(/验证码(\d{6})/), 1)
    console.log('text', txt, theCode)
    if (isNotEmpty(theCode)) {
      setVerifyCode(theCode)
    }
  }

  const handleBindingWechatMobile = async (e) => {
    const { encryptedData, errMsg, iv } = e.detail
    // const { code } = rootStore

    /* ---------------- 是否授权，授权通过进入主页面，授权拒绝则停留在登陆界面 start-------------------------------*/
    if (errMsg == 'getPhoneNumber:user deny') {
      // 用户点击拒绝
      GlobalToast.show({ text: `登录失败！` })
    } else {
      // 业务登录允许授权执行跳转
      try {
        await NavigationService.dispatch('loginModel/login', {
          loginMethod: 'wechat_mobile',
          encryptedData,
          iv
          // code
        })
      } catch (error) {
        GlobalToast.show({ text: `登录失败！` })
        NavigationService.dispatch('loginModel/logout')
      }
    }
    /* ---------------- 是否授权，授权通过进入主页面，授权拒绝则停留在登陆界面 end-------------------------------*/
  }

  if (visible) {
    return (
      <>
        <RHMButton
          openType='getPhoneNumber'
          className={`${
            btnProps.disabled ? '' : 'login-button-active'
          } 'login-button'`}
          onGetPhoneNumber={handleBindingWechatMobile}
          {...btnProps}
        >
          <Text style={{ color: '#fff' }}>微信用户一键登录</Text>
        </RHMButton>
        {onlyWxMobile && (
          <View className='login-form-fields-switch'>
            <RHMButton mode='ghost' onClick={toggle}>
              其他手机号码
            </RHMButton>
          </View>
        )}
      </>
    )
  }

  return (
    <>
      <View className='login-form-fields'>
        <RHMMobileVerifyCode
          name='mobile'
          className='login-form-fields-input'
          placeholder='请输入手机号'
          value={mobile}
          onChange={(v) => setMobile(v.detail.value)}
          onSendCodeSuccess={handleSendCodeSuccess}
        />
        <Field
          bordered={false}
          className='login-form-fields-input,login-form-fields-vcode'
          placeholder='请输入短信验证码'
          type='number'
          value={verifyCode}
          onChange={(v) => setVerifyCode(v.detail.value)}
        ></Field>
      </View>
      <View className='login-form-fields-switch'>
        <RHMButton mode='ghost' onClick={toggle}>
          使用微信绑定手机号
        </RHMButton>
      </View>

      <RHMButton className='login-button' onClick={handleSubmit}>
        登录
      </RHMButton>
    </>
  )
}
