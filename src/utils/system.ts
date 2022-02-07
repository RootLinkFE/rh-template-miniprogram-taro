import Taro from '@tarojs/taro'

// 获取小程序系统信息
const get = (cb?: (...args) => void) => {
  // 设备信息
  const info = {
    // 系统设备信息原对象
    info: {} as Taro.getSystemInfoSync.Result,
    // 是否为iOS
    isIOS: false,
    // 是否为iphoneX XR XS...等iOS系统全面屏手机
    isIphoneX: false,
    // 是否为安卓
    isAndroid: false,
    // 是否为Mac
    isMac: false,
    // 是否为Windows
    isWindows: false,
    // 设备像素比 (px 与 rpx 的转换比例, 公式：px * pixelRatio = rpx)
    pixelRatio: 1,
    // 屏幕宽度
    screenWidth: 0,
    screenWidthRPX: 0,
    // 屏幕高度
    screenHeight: 0,
    screenHeightRPX: 0,
    // 状态栏高度
    statusBarHeight: 0,
    statusBarHeightRPX: 0,
    // 导航栏高度(不包括状态栏，单纯的导航栏高度)
    navigationBarHeight: 0,
    navigationBarHeightRPX: 0,
    // 导航栏高度(包括状态栏，整个导航栏高度)
    navigationHeight: 0,
    navigationHeightRPX: 0,
    // 底部TabBar菜单栏高度
    tabBarHeight: 0,
    tabBarHeightRPX: 0
  }

  try {
    const systemInfo = Taro.getSystemInfoSync()
    // 右上角菜单胶囊范围
    let menuButtonRect = Taro.getMenuButtonBoundingClientRect()

    // 状态栏默认高度
    const statusBarHeight = 20
    // 导航栏默认高度
    const navigationBarHeight = 44
    // TabBar默认高度
    const tabBarHeight = 48

    // 记录原始数据
    info.info = systemInfo

    // 是否为iOS
    info.isIOS = systemInfo.system.indexOf('iOS') !== -1
    // 是否为iOS系统全面屏手机
    if (info.isIOS) {
      // 如果为 iOS 且安全区域上面超过 默认状态栏高度 则为 X 系列
      info.isIphoneX = systemInfo.safeArea.top > statusBarHeight
    }

    // 是否为安卓
    info.isAndroid = systemInfo.system.indexOf('Android') !== -1

    // 是否为Mac
    info.isMac = systemInfo.system.indexOf('macOS') !== -1

    // 是否为Windows
    info.isWindows = systemInfo.system.indexOf('Windows') !== -1

    // 设备像素比(750 / 屏幕宽度)
    // 系统给成的 systemInfo.pixelRatio 值不对，所以使用自己换算出来的比例
    info.pixelRatio = 750 / systemInfo.windowWidth

    // 屏幕宽度
    info.screenWidth = systemInfo.screenWidth
    // 屏幕宽度 - RPX
    info.screenWidthRPX = info.screenWidth * info.pixelRatio

    // 屏幕高度
    info.screenHeight = systemInfo.screenHeight
    // 屏幕高度 - RPX
    info.screenHeightRPX = info.screenHeight * info.pixelRatio

    // 状态栏高度
    info.statusBarHeight = Math.max(systemInfo.statusBarHeight, statusBarHeight)
    // 状态栏高度 - RPX
    info.statusBarHeightRPX = info.statusBarHeight * info.pixelRatio

    // 导航栏高度
    const menuBarHeight =
      (menuButtonRect.top - info.statusBarHeight) * 2 + menuButtonRect.height
    info.navigationBarHeight = Math.max(menuBarHeight, navigationBarHeight)
    // 导航栏高度 - 如果为奇数则转成偶数
    if (info.navigationBarHeight % 2) {
      info.navigationBarHeight += 1
    }
    // 导航栏高度 - RPX
    info.navigationBarHeightRPX = info.navigationBarHeight * info.pixelRatio

    // 导航栏高度
    info.navigationHeight = info.statusBarHeight + info.navigationBarHeight
    // 导航栏高度 - RPX
    info.navigationHeightRPX = info.navigationHeight * info.pixelRatio

    // 底部TabBar菜单栏高度
    info.tabBarHeight = Math.max(
      info.screenHeight - info.navigationHeight - systemInfo.windowHeight,
      tabBarHeight
    )
    // 底部TabBar菜单栏高度 - 如果为奇数则转成偶数
    if (info.tabBarHeight % 2) {
      info.tabBarHeight += 1
    }
    // 底部TabBar菜单栏高度 - RPX
    info.tabBarHeightRPX = info.tabBarHeight * info.pixelRatio
  } catch (error) {}
  return info
}

// 获取小程序更新版本信息
const update = () => {
  if (Taro.canIUse('getUpdateManager')) {
    const updateManager = Taro.getUpdateManager()
    updateManager.onCheckForUpdate((res) => {
      console.log('checking app update .......')
      if (res.hasUpdate) {
        updateManager.onUpdateReady(() => {
          // noinspection JSIgnoredPromiseFromCall
          Taro.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: function(res) {
              if (res.confirm) {
                updateManager.applyUpdate()
              }
            }
          })
        })
        updateManager.onUpdateFailed(() => {
          // noinspection JSIgnoredPromiseFromCall
          Taro.showModal({
            title: '更新提示',
            content: '新版本下载失败，请检查网络！',
            showCancel: false
          })
        })
      }
    })
  } else {
    // noinspection JSIgnoredPromiseFromCall
    Taro.showModal({
      title: '微信升级',
      content: '当前微信版本过低，部分功能无法使用，请升级到最新版本',
      showCancel: false
    })
  }
}

const SystemPower = {
  get,
  update
}
export default SystemPower
