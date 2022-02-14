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

return 123

// 监听package.json 文件版本更新，然后脚本自动修改NODE_MODULES_VERSION版本号
exec('git diff --cached --name-only package.json', function(
  error,
  stdout,
  stderr
) {
  const regexStr = `NODE_MODULES_VERSION: '${npmPackageName}-(.*?)'`
  const regex = new RegExp(regexStr, 'g')
  let newData = ''
  if (error) {
    console.error('error: ' + error)
    return false
  }
  console.log('git diff stdout: ', stdout)
  if (!stdout) {
    console.log('package.json 无修改')
    return false
  }
  return true
})
