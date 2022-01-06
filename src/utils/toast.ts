import Taro from '@tarojs/taro'
import { sleep } from '@/utils/common'

/**
 * export type GlobalToastProps = {
      text: string;
      duration?: number;
      icon?: 'success' | 'loading' | 'none';
   }
 */
export default class GlobalToast {
  static async show({
    text,
    duration = 2000,
    icon = 'none',
    mask = false,
    needWaitTime = 0
  }) {
    if (needWaitTime) {
      await Taro.showToast({ title: text, duration, icon, mask })
      return await sleep(needWaitTime)
    }
    return await Taro.showToast({ title: text, duration, icon, mask })
  }
  static async hide() {
    return await Taro.hideToast()
  }
}
