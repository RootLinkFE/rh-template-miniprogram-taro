# 小程序模板

### 技术栈

Taro + Taro-UI + DVA

### Todo

- 页面、组件
- [x] 登录组件（微信登录、表单登录、验证码登录）
- [x] 按钮组件（封装微信和通用按钮相关功能）

- 服务
- [x] 二次封装 Taro 跳转功能
- [x] 网络请求

### Useage

```shell
yarn install
npm run start:[env]
```

### CI

方便快速和测试人员联动提供预览版本
本地CI必须要小程序上传秘钥，并放在根目录private.key文件下，问小程序负责人要，不能上传秘钥文件

#### 步骤
- 配置private.key文件
- 配置scripts/notice/index.js 下的WEB_HOOK路径

```shell
npm run postpublish
```
