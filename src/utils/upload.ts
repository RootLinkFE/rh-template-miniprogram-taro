import { RES_SUCCESS_DEFAULT_CODE, TOKEN_KEY, BASE_URL } from '@/config/const'
import Taro from '@tarojs/taro'
import GlobalToast from './toast'

const UPLOAD_SERVER_URL = '/third-party/v1/api/file/file-upload'

const getFileNameByUrl = (url) => {
  return url?.substr(url.lastIndexOf('/') + 1)
}

const getTokenStorage = () =>
  Taro.getStorageSync(TOKEN_KEY)
    ? `bearer ${Taro.getStorageSync(TOKEN_KEY)}`
    : ''

/**
 * COS直传
 * @param {*} filePath
 */
export default function uploadPicture(filePath) {
  return new Promise((resolve, reject) => {
    console.log(filePath)
    let fileName = getFileNameByUrl(filePath)
    const formData = {
      type: 'PRIVATELY',
      file: filePath,
      fileName
    }
    console.log(BASE_URL + UPLOAD_SERVER_URL, 'BASEURL + UPLOAD_SERVER_URL')
    Taro.uploadFile({
      url: BASE_URL + UPLOAD_SERVER_URL,
      filePath,
      name: 'file',
      header: {
        Authorization: getTokenStorage()
      },
      formData
    })
      .then(({ errMsg, data: uploadData }) => {
        const { code, data, desc } = JSON.parse(uploadData)
        if (errMsg === 'uploadFile:ok' && code === RES_SUCCESS_DEFAULT_CODE) {
          return resolve(data)
        }
        GlobalToast.show({ text: '上传失败' })
        return reject(desc)
      })
      .catch((err = {}) => {
        console.log(err)
        GlobalToast.show({ text: '上传失败' + JSON.stringify(err) })
        return reject(err)
      })
  })
}
