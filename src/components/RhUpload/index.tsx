import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { Uploader } from '@taroify/core'
import PropTypes from 'prop-types'
import Taro from '@tarojs/taro'
import { promiseHandle } from '@/utils/common'
import uploadPicture from '@/utils/upload'
import GlobalToast from '@/utils/toast'
import { View } from '@tarojs/components'
import { getFileExtension } from './utils'
import './index.less'

function RhUpload(props) {
  const {
    value,
    onChange,
    sizeLimit = 10,
    isCircle = false,
    multiple = false,
    maxFiles = 10,
    accept = '.jpg,.png,.gif',
    ...uploadProps
  } = props
  const filesRef = useRef<any[]>([])
  const [files, setFiles] = useState<any[]>([])

  useEffect(() => {
    if (value) {
      filesRef.current = value
      setFiles(value)
    }
  }, [value])

  const handleRemove = useCallback(
    (image, e) => {
      e.stopPropagation()
      const arr = files.filter((item) => item.url !== image.url)
      filesRef.current = arr
      setFiles(filesRef.current)
      onChange?.(filesRef.current)
    },
    [files, filesRef, setFiles]
  )

  const handlePreview = useCallback(
    (currUrl) => {
      const urls = files.map((item) => item.url)
      Taro.previewImage({
        current: currUrl, // 当前显示图片的http链接
        urls, // 需要预览的图片http链接列表
      })
    },
    [files]
  )

  const isMaxFiles = useMemo(() => files.length >= maxFiles, [
    files.length,
    maxFiles,
  ])

  const disableType = useMemo(
    () => uploadProps.readonly || uploadProps.disabled,
    [uploadProps]
  )

  const overLimit = useCallback(
    ({ size: imgSize, path: filePath }) => {
      // *号不校验文件类型
      if (accept !== '*') {
        const extension = getFileExtension(filePath)
        // 没有文件类型的并且后缀名不允许的不允许上传
        if (!accept.includes(extension)) {
          GlobalToast.show({ text: '不允许上传该类型的文件' })
          return false
        }
      }

      if (imgSize > sizeLimit * 1024 * 1024) {
        GlobalToast.show({ text: `文件大小不允许超过${sizeLimit}M` })
        return false
      }
      return true
    },
    [sizeLimit, accept]
  )

  // 图片上传
  const handleCustomUpload = async () => {
    try {
      const [chooseErr, chooseFile] = await promiseHandle(
        Taro.chooseImage({
          count: !!multiple ? 99 : 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
        })
      )

      if (chooseErr) return
      const { errMsg, tempFiles, tempFilePaths } = chooseFile
      const totalFiles = tempFiles.length + filesRef.current.length
      if (totalFiles > maxFiles)
        return GlobalToast.show({
          text: `上传文件数量已大于${maxFiles}张，请重新选择`,
        })
      for (let item of tempFiles) {
        const { size, path } = item
        if (!overLimit(item)) return
        if (errMsg === 'chooseImage:ok') {
          const [cosErr, cosFile] = await promiseHandle(uploadPicture(path))
          if (cosErr) return
          const { url, fileName, fileType, id } = cosFile
          filesRef.current.push({
            url,
            extension: fileType,
            fileName: fileName,
            fileId: id,
          })
        }
      }
      setFiles([...filesRef.current])
      onChange?.(filesRef.current)
    } catch (error) {
      console.log(error)
      GlobalToast.show({ text: '上传失败' + JSON.stringify(error) })
    }
  }

  return (
    <View className='upload'>
      <Uploader
        value={files}
        multiple
        onUpload={handleCustomUpload}
        onChange={setFiles}
        className={isCircle ? 'circle' : ''}
        {...uploadProps}
      >
        {files.map((image: any) => (
          <Uploader.Image
            key={image.url}
            url={image.url}
            name={image.name}
            type={image.type}
            removable={!disableType}
            onRemove={(e) => handleRemove(image, e)}
            onClick={() => handlePreview(image.url)}
          ></Uploader.Image>
        ))}
        {!isMaxFiles && !disableType && <Uploader.Upload />}
      </Uploader>
      <View className='upload-tips'>{props.tips}</View>
    </View>
  )
}

export default RhUpload

RhUpload.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func,
  sizeLimit: PropTypes.number,
  tips: PropTypes.string,
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  isCircle: PropTypes.bool,
}
