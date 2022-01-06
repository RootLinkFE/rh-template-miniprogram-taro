import { useEffect, useRef, useState } from 'react'
import { isString } from '@/utils/mylodash'
import Taro from '@tarojs/taro'
import Config from '@/config'

// boolean类型的控制属性，show，close，toggle
export function useVisible(initial = false) {
  const [visible, setVisible] = useState(initial)
  const show = () => setVisible(true)
  const close = () => setVisible(false)
  const toggle = () => setVisible(!visible)
  return {
    visible,
    show,
    close,
    toggle
  }
}

export function useLoading(initial = false) {
  const [loading, setLoading] = useState(initial)
  const showLoading = () => setLoading(true)
  const hideLoading = () => setLoading(false)
  return {
    loading,
    showLoading,
    hideLoading
  }
}

// 这只page的title
export function usePageTitle(value) {
  useEffect(() => {
    let theTitle = isString(value)
      ? value
      : value?.pageTitle || value?.title || Config.name
    Taro.setNavigationBarTitle({
      title: theTitle || Config.name
    })
  }, [value])
}
