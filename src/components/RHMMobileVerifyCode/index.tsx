import * as loginApi from '@/api/login'
import { noop } from '@/utils/common'
import { Button, Field } from '@taroify/core'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import './index.less'


function useCountdown(maxCount = 60, onEndOfCounting) {
  const [second, setSecond] = useState(maxCount)
  const [counting, setCounting] = useState(false)
  const interval = useRef()

  const startCount = () => setCounting(true)

  useEffect(() => {
    if (!counting) {
      return
    }
    setCounting(true)
    console.log('countdown....run')
    // @ts-ignore
    interval.current = setInterval(() => {
      setSecond((t) => {
        const result = t - 1
        console.log('countdown....run....', result)
        if (result === 0) {
          clearInterval(interval.current)
          setCounting(false)
          if (onEndOfCounting) {
            onEndOfCounting()
          }
          return maxCount
        }
        return result
      })
    }, 1000)
    return () => clearInterval(interval.current)
  }, [counting, maxCount, onEndOfCounting])
  return {
    second,
    counting,
    startCount
  }
}

function RHMMobileVerifyCode(props) {
  const { second, counting, startCount } = useCountdown(props.maxCount)

  const {
    onChange,
    name,
    value = '',
    placeholder,
    className,
    onSendCodeSuccess = noop
  } = props

  const sendCode = async () => {
    if (counting) {
      return
    }
    if (!/^1\d{10}$/.test(value)) {
      await Taro.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }
    startCount()
    loginApi.getSms({ mobile: value }).then((res) => {
      onSendCodeSuccess(res)
    })
  }

  const tips = counting ? `${second}秒...` : '发送验证码'
  const rootClass = classNames('rhm-vcode', className)
  const txtClass = classNames('rhm-vcode-txt', {
    'rhm-vcode-txt-disabled': counting
  })
  return (
    <Field
      className={rootClass}
      placeholder={placeholder}
      type='number'
      value={value}
      onChange={onChange}
    >
      <Field.Button>
        <Button
          size='small'
          color='primary'
          className={txtClass}
          onClick={sendCode}
        >
          {tips}
        </Button>
      </Field.Button>
    </Field>
  )
}

RHMMobileVerifyCode.defaultProps = {
  name: '',
  placeholder: '请输入手机号码',
  onChange: noop,
  maxCount: 60
}
export default RHMMobileVerifyCode
