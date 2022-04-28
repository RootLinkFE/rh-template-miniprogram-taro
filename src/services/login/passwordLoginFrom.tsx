import RhButton from '@/components/RhButton'
import NavigationService from '@/utils/navigation'
import { Cell, Field } from '@taroify/core'
import { View } from '@tarojs/components'
import { useState } from 'react'

export default function PasswordForm() {
  const [login, setLogin] = useState()
  const [password, setPassword] = useState()

  const handleSubmit = () => {
    NavigationService.dispatch('loginModel/login', {
      loginMethod: 'account_password',
      login,
      password,
    })
  }

  return (
    <>
      <View className='login-form-fields'>
        <Cell.Group>
          <Field
            className='login-form-fields-input'
            placeholder='请输入用户名'
            value={login}
            onChange={(v) => setLogin(v.detail.value)}
          />
          <Field
            className='login-form-fields-input'
            placeholder='请输入密码'
            type='password'
            value={password}
            onChange={(v) => setPassword(v.detail.value)}
          />
        </Cell.Group>
      </View>
      <RhButton className='login-button' onClick={handleSubmit}>
        登录
      </RhButton>
    </>
  )
}
