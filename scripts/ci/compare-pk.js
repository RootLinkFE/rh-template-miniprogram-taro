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
exec('git diff -w package.json', function(
  error,
  stdout,
  stderr
) {
  try {
    const regexStr = `NODE_MODULES_VERSION: '${npmPackageName}-(.*?)'`
    const regex = new RegExp(regexStr, 'g')
    let newData = ''
    if (error) {
      throw error
    }
    console.log('git diff stdout: ', stdout)
    if (!stdout) {
      console.log('package.json 无修改')
      throw '无修改'
    }
    return true
  } catch (error) {
    console.error('error1: ' + error)
  }
})
