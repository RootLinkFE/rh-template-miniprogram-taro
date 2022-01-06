// import * as MasterAPI from '@/api/master'
import Taro from '@tarojs/taro'
import { TOKEN_KEY, USERINFO_KEY } from '@/config/const'

const getUserInfoStorage = (field) => Taro.getStorageSync(USERINFO_KEY)?.[field]

export default {
  namespace: 'commonModel',
  state: {
    accessToken: Taro.getStorageSync(TOKEN_KEY),
    hasUserInfo: !!getUserInfoStorage('phone'),
    userInfo: Taro.getStorageSync(USERINFO_KEY),
    mobile: getUserInfoStorage('phone') || '',
    username: getUserInfoStorage('name') || ''
  },

  effects: {
    *fetchUserInfo() {
      console.log('logout from app')
      return {}
    }
  },

  reducers: {
    save(state) {
      console.log(state, 'model')
      return {
        ...state,
        accessToken: Taro.getStorageSync(TOKEN_KEY),
        hasUserInfo: !!getUserInfoStorage('phone'),
        userInfo: Taro.getStorageSync(USERINFO_KEY),
        mobile: getUserInfoStorage('phone') || '',
        username: getUserInfoStorage('name') || ''
      }
    },
    clean(state) {
      const obj = { ...state }
      for (let key in state) {
        obj[key] = ''
      }
      return { ...state, ...obj }
    }
  }
}
