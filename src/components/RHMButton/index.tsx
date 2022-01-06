import React from 'react'
import PropTypes from 'prop-types'
import { getExtMode, isNotEmpty, debounce } from '@/utils/common'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { Button } from '@taroify/core'
import NavigationService, { NavigationMethodType } from '@/utils/navigation'

import './index.less'

// form中组件封装后，button 不会触发form的handle方法问题
// https://github.com/NervJS/taro-ui/issues/96

function RHMButton(props) {
  const {
    linkToUrl,
    extraData,
    title,
    size,
    type,
    icon,
    imageUrl,
    mode,
    ajax = false,
    disabled,
    navigationMethod,
    openType,
    onClick,
    className,
    children,
    code,
    id,
    ...others
  } = props

  // console.log('the action code & id', code, id);
  let wxOpenType = openType
  if (!openType && (type === 'share' || type === 'getPhoneNumber')) {
    wxOpenType = type
  }

  const formType = type === 'submit' || type === 'reset' ? type : null

  const handleMakeCall = () => {
    const { phoneNumber } = extraData
    if (phoneNumber) {
      // noinspection JSIgnoredPromiseFromCall
      Taro.makePhoneCall({ phoneNumber })
    }
  }

  const handleScan = async () => {
    const res = await Taro.scanCode()
    const arg = encodeURIComponent(res.result)
    const actionPath = `${linkToUrl}${arg}/`
    console.log('I want to access ', actionPath)
    await NavigationService.replace(linkToUrl, res.result)
  }

  const handlePreview = async () => {
    console.log('preview document', linkToUrl)
    if (!linkToUrl) {
      return
    }
    try {
      await Taro.showLoading({ title: '正在打开文件...', mask: true })
      const res = await Taro.downloadFile({ url: linkToUrl })
      await Taro.openDocument({ filePath: res.tempFilePath })
    } catch (e) {
      await Taro.showToast({ title: '文件打开失败，稍后重试', icon: 'none' })
    } finally {
      Taro.hideLoading()
    }
  }

  const handleDownload = async () => {
    if (!linkToUrl) {
      return
    }
    try {
      await Taro.showLoading({ title: '正在下载文件...', mask: true })
      await Taro.downloadFile({ url: linkToUrl })
    } catch (e) {
      await Taro.showToast({ title: '下载文件失败，稍后重试', icon: 'none' })
    } finally {
      Taro.hideLoading()
    }
  }

  const handleCopy = () => {
    if (isNotEmpty(extraData)) {
      // noinspection JSIgnoredPromiseFromCall
      Taro.setClipboardData({
        data: JSON.stringify(extraData),
        success: () =>
          Taro.showToast({
            title: '已经复制到内存, 请分享或在浏览器中打开',
            icon: 'none',
            duration: 5000
          })
      })
    }
  }

  const handleClick = debounce(async (e) => {
    if (onClick) {
      onClick(e)
      return
    }

    if (type === 'submit' || type === 'share') {
      return
    }

    if (type === 'makeCall') {
      handleMakeCall()
      return
    }

    if (type === 'open-document') {
      await handlePreview()
      return
    }
    if (type === 'download') {
      await handleDownload()
      return
    }
    if (type === 'copy') {
      handleCopy()
      return
    }
    if (type === 'scanner') {
      await handleScan()
      return
    }

    console.log('type is', type, 'just do view action', props)

    await NavigationService.push(linkToUrl)
  }, 200)

  const rootClass = getExtMode(mode, { disabled }).classNames(
    'rhm-button',
    className
  )

  const buttonSize = size === 'small' ? 'mini' : size

  return (
    <Button
      className={rootClass}
      openType={wxOpenType}
      formType={formType}
      size={buttonSize}
      onClick={handleClick}
      data-extraData={extraData}
      disabled={disabled}
      {...others}
    >
      {children || (
        <View className='rhm-button-body'>
          {/* <ActionIcon icon={icon} imageUrl={imageUrl} />
          <AtIcon value='clock' size='30' color='#F00'></AtIcon> */}
          <View className='rhm-button-text'>{title}</View>
        </View>
      )}
    </Button>
  )
}

RHMButton.propTypes = {
  size: 'small' | 'default',
  type: PropTypes.string,
  ajax: PropTypes.bool,
  disabled: PropTypes.bool,
  navigationMethod: NavigationMethodType,
  openType: PropTypes.string,
  children: React.ReactNode,
  className: PropTypes.string,
  mode:
    'normal' | 'warn' | 'danger' | 'info' | 'secondary' | 'radius0' | 'ghost',
  onGetPhoneNumber: PropTypes.any,
  icon: PropTypes.string,
  imageUrl: PropTypes.string,
  onClick: PropTypes.func
}

export default RHMButton
