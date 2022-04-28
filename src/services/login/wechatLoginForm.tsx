import RhButton from '@/components/RhButton'
import NavigationService from '@/utils/navigation'

export default function WechatLoginForm(props) {
  const { btnProps = {} } = props

  const handleSubmit = () => {
    let loginMethod = 'wechat_mobile'
    NavigationService.dispatch('loginModel/login', {
      loginMethod,
    })
  }
  return (
    <RhButton className='login-button' onClick={handleSubmit} {...btnProps}>
      微信用户一键登录
    </RhButton>
  )
}
