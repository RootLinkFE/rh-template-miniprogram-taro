'use strict'

const fs = require('fs')
const exec = require('child_process').exec
// const execSync = require('child_process').execSync;
const npmPackageName = process.env.npm_package_name
const uri = './.gitlab-ci.yml'

const uuid = () => {
  return `${Math.random()
    .toString(36)
    .substr(2)}`
}

// 监听package.json 文件版本更新，然后脚本自动修改NODE_MODULES_VERSION版本号
exec('git diff 7e18822 a9cbda7 ./package.json', function(
  error,
  stdout,
  stderr
) {
  try {
    const regexStr = `NODE_MODULES_VERSION: '${npmPackageName}-(.*?)'`
    const regex = new RegExp(regexStr, 'g')
    let newData = ''
    console.log('git diff stdout: ', stdout, '123', stderr, 'error', error)
    if (error) {
      throw error
    }
    if (!stdout) {
      console.log('package.json 无修改')
      throw '无修改'
    }
    return true
  } catch (error) {
    return new Error('asd')
    console.error('error1: ' + error)
  }
})
