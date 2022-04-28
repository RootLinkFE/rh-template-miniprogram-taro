## 自定义底部 Tabbar RhTabbar

### 使用方式

1. 在需要的页面添加组件

```jsx
<RhTabbar route={'当前页面路由'}></RhTabbar>
```

2. 如果有自定义 tabbar，需在 app.tsx 定义 customNode 作为全局变量

```ts
class App {
  customNode: {
    iconName: string // 需要根据export的名字动态引入图片，import * as ImageService from '@/services/dynamicImage'
    pagePath: string
    needTabBar?: boolean // pagePath页面是否需要tabbar
    pagePathParams?: Record<string, any>
    activeStyle?: Partial<CSSStyleDeclaration>
    style?: Partial<CSSStyleDeclaration>
  }
}
```

### 注意事项

1. 第一次打开页面必然会出现一次闪烁，无法避免，如果不能接受建议改 UI
2. 依赖动态图片引入服务，taro3.x 没法直接使用 commonjs 方式动态引入
3. 目前只支持添加一种特殊图标居中在 tabbar 中间，如有特殊需要自行修改组件
