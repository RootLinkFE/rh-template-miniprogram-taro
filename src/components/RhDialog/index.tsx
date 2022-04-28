import React, { useCallback } from 'react'
import { Dialog } from '@taroify/core'
import { isPromise } from '@/utils/common'
import { Text, View } from '@tarojs/components'
import './index.less'

// type RhDialogType = {
//   open: boolean,
//   onConfirm: () => void,
//   onCancel: () => void,
//   options: {
//     header: string | ReactNode,
//     content: ReactNode,
//     confirmText: string, // '确认'
//     cancelText: string // '取消'
//   }
// }

function RhDialog(props) {
  const {
    open = false,
    onClose = () => {},
    onConfirm = null,
    onCancel = null,
    options = {
      header: '',
      content: '',
      confirmText: '', // '确认'
      cancelText: '', // '取消'
    },
  } = props

  if (!onClose || !onConfirm) {
    throw 'dialog need onClose & onConfirm'
  }

  const handleConfirm = useCallback(() => {
    onConfirm?.()
  }, [onConfirm])

  const handleCancel = useCallback(() => {
    if (onCancel) {
      return onCancel()
    }
    onClose()
  }, [onCancel, onClose])

  return (
    <Dialog open={open} onClose={onClose}>
      {options.header && <Dialog.Header>{options.header}</Dialog.Header>}
      <Dialog.Content>{options.content || '内容'}</Dialog.Content>
      <Dialog.Actions>
        <View
          className='item-btn btn-reject dialog-btn'
          onClick={() => handleCancel()}
        >
          {options.cancelText || '取消'}
        </View>
        <View
          className='item-btn btn-agree dialog-btn'
          onClick={() => handleConfirm()}
        >
          {options.confirmText || '确认'}
        </View>
      </Dialog.Actions>
    </Dialog>
  )
}

export default RhDialog
