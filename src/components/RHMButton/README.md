###### 按钮 RHMButton

|           | 样例                            | 描述                                                                           |
| --------- | ------------------------------- | ------------------------------------------------------------------------------ |
| title     | button='提交'                   | 展示的文字，也可以通过 children 来包装其他组件                                 |
| type      | type=’share‘                    | 可选值：share，getPhoneNumber，submit，reset，open-document，download，scanner |
| size      | size='mini'                     | TaroUI 中 Button 的 size 属性                                                  |
| uiType    | uiType='primary'                | TaroUI 中 Button 的 type 属性                                                  |
| full      | full='false'                    | TaroUI 中 Button 的 full 属性                                                  |
| circle    | circle='false'                  | TaroUI 中 Button 的 circle 属性                                                |
| linkToUrl | linkToUrl='/m/view/'            | 当 type 是空的时候，默认执行 Navigation.view(linkToUrl)                        |
| onClick   | onClick={()=>console.log("11")} | EleButton 优先执行传入的 onClick 事件                                          |

- type='share' 实际调用 Taro button 的 openType='share'

- type='getPhoneNumber' 实际调用 Taro button 的 openType='getPhoneNumber'

- type='submit' 实际调用 Taro button 的 openType='submit'

- type='submit' 实际调用 Taro button 的 openType='reset'

- type='open-document' ，下载 linkToUrl 对应的文档文件并打开

- type='download' ，下载 linkToUrl 对应的文件

- type='scanner' ，调用摄像头扫描二维码，并将扫描到的参数作为参数拼接到 linkToUrl 上。

```javascript
<EleButton
      title='Go Baidu'
      uiType='primary'
      linkToUrl='https://www.baidu.com/'
/>

<View style={{ padding: '10px' }} />

<EleButton
      type='download'
      size='small'
      linkToUrl='https://www.baidu.com/'
>
    <ActionIcon value='download-cloud' />
</EleButton>
```
