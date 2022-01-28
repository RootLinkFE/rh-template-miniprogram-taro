import Taro from '@tarojs/taro'
import { regionJSON } from '../components/RHMForm/components/picker/addrData'
import GlobalToast from '../utils/toast'

const QQMapWX = require('@/assets/libs/qqmap-wx-jssdk.min.js')

let mapSdk = null

interface Location {
  lat: string
  lng: string
}

interface AddrInfo extends Location {
  address: string
  addressTitle: string
  proviceName?: string
  proviceCode?: string
}

export function loadMapsSDK() {
  if (mapSdk) {
    return Promise.resolve(mapSdk)
  }
  return new Promise((resolve) => {
    mapSdk = new QQMapWX({ key: 'HAWBZ-VTSW3-NUB3P-3CJHD-5FG2Q-VUF4R' })
    resolve(mapSdk)
  })
}

// 地图授权
function getUserLocation(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const setting = await Taro.getSetting()
      if (!setting.authSetting['scope.userLocation']) {
        Taro.authorize({
          scope: 'scope.userLocation'
        })
          .then(() => resolve())
          .catch(() => {
            Taro.showToast({
              title: '您未允许授权获取地理位置信息，请前往设置',
              icon: 'none',
              duration: 3000
            })
            reject()
          })
      } else {
        resolve()
      }
    } catch (error) {
      GlobalToast.show({ text: '获取用户设置权限失败！' })
      reject()
    }
  })
}

// 选择地图
async function chooseLocation(params?: any): Promise<any> {
  try {
    await getUserLocation()
    return Taro.chooseLocation(params)
  } catch (error) {
    Promise.reject()
  }
}

export async function getAddr(params?: any): Promise<AddrInfo> {
  const locationData = await chooseLocation(params)
  const sdk: any = await loadMapsSDK()
  if (!sdk) {
    console.error('sdk 加载失败！')
    return locationData
  }
  return new Promise((resolve, reject) => {
    const { latitude, longitude, address, name: addressTitle } = locationData
    sdk?.reverseGeocoder({
      location: {
        latitude,
        longitude
      },
      success: ({ result }) => {
        const provinceName = result.address_component.province
        const data = {
          address,
          addressTitle,
          lat: locationData.latitude,
          lng: locationData.longitude,
          provinceName: provinceName,
          provinceCode: regionJSON.filter(
            (province) => province.name === provinceName
          )[0]?.['code']
        }
        resolve(data)
      },
      fail: reject
    })
  })
}
