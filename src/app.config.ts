export default {
  pages: ['pages/home/index', 'pages/mine/index'],
  subPackages: [
    {
      root: 'pagesA',
      pages: ['demo/index', 'login/index']
    }
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#929292',
    selectedColor: '#D92500',
    backgroundColor: '#fafafa',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        iconPath: './assets/images/work_unselected@3x.png',
        selectedIconPath: './assets/images/work_selected@3x.png',
        text: '首页'
      },
      {
        pagePath: 'pages/mine/index',
        iconPath: './assets/images/mine_unselected@3x.png',
        selectedIconPath: './assets/images/mine_selected@3x.png',
        text: '我的'
      }
    ]
  }
}
