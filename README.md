# 小程序模板

### 技术栈

Taro + taroify UI + mobx4

### TODO

- 页面、组件
  - [x] 登录组件（微信登录、表单登录、验证码登录）
  - [x] 按钮组件（封装微信和通用按钮相关功能）
  - [x] 自定义底部 tabbar（体验开关 config/index.js `NEED_CUSTOM_TABBAR` 变量）
- 服务
  - [x] 二次封装 Taro 跳转功能
  - [x] 网络请求
  - [x] 腾讯地图服务

### Useage

```shell
yarn install
npm run start:[env]
```

### CI

方便快速和测试人员联动提供预览版本
本地 CI 必须要小程序上传秘钥，并放在根目录 `private.key` 文件下，问小程序负责人要，不能上传秘钥文件

#### 步骤

- 配置 `private.key` 文件
- 配置 `scripts/notice/index.js` 下的 `WEB_HOOK` 路径

```shell
npm run postpublish
```
