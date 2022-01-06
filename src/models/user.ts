// import * as MasterAPI from '@/api/master'
import Taro from '@tarojs/taro'
import { USERINFO_KEY } from '@/config/const'

export default {
  namespace: 'userModel',
  state: {
    userInfo: {}
  },

  effects: {
    *fetchUserInfo({ payload }, { put }) {
      // const userInfo = yield MasterAPI.userInfo()
      // yield put({ type: 'save', userInfo })
      yield put({ type: 'save' })
    }
  },

  reducers: {
    save(state, userInfo) {
      const { phone, name } = userInfo
      console.log()
      Taro.setStorageSync(USERINFO_KEY, {
        phone,
        name
      })
      return { ...state, ...userInfo }
    },
    clean() {
      Taro.removeStorageSync(USERINFO_KEY)
      return { userInfo: {} }
    }
  }
}
