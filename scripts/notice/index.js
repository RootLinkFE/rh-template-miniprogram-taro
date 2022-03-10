const request = require('request')
const formatDate = require('./utils')
const path = require('path')
const fs = require('fs')
const md5 = require('md5')
const exec = require('child_process').exec

const branchName = process.argv[2]

const WEB_HOOK = ''

if (!WEB_HOOK) throw '请配置WEB_HOOK地址'

function getImgParams() {
  const previewImgPath = path.join('./preview.png')

  return new Promise((resolve) => {
    const content = fs.readFileSync(previewImgPath)
    const md5Code = md5(content)
    // const base64 = Base64.encode(content);
    const base64 = Buffer.from(content, 'binary').toString('base64')
    resolve({ md5Code, base64 })
  })
}

function noticeMsg() {
  const newDate = new Date()
  return new Promise((resolve, reject) => {
    exec('git log --oneline -1', (error, stdout) => {
      if (error) {
        console.error('error: ' + error)
        return reject()
      }
      const data = {
        msgtype: 'markdown',
        markdown: {
          content: `
          > 项目名称：<font color="blue">Taro小程序</font>
          > 分支：<font color="blue">${branchName}</font>
          > 发布人：本地开发者
          > 发布时间：${formatDate(newDate)}
          >二维码失效时间： <font color="red">${formatDate(
            new Date(newDate.setMinutes(newDate.getMinutes() + 30))
          )}</font>`
        }
      }
      request.post(
        WEB_HOOK,
        {
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        },
        function(err) {
          if (err) {
            console.error(err)
            return reject()
          }
          resolve()
        }
      )
    })
  })
}

async function noticeQCode() {
  try {
    await noticeMsg()
    const { md5Code, base64 } = await getImgParams()
    const data = {
      msgtype: 'image',
      image: {
        base64,
        md5: md5Code
      }
    }
    request.post(
      WEB_HOOK,
      {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      },
      function(err, resp, body) {
        if (err) {
          console.error(err)
        }
      }
    )
  } catch (error) {
    console.log('noticeQCode error')
  }
}

noticeQCode()
