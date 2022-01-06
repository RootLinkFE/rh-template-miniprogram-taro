export const phoneValidRegx = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/
export const identityValidRegex = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/g
export const checkCreditValid = (rule, value) => {
  const regex = /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g
  if (value && !regex.test(value)) {
    return Promise.reject(
      new Error('社会统一信用代码应由18位数字+大写字母组成')
    )
  }
  return Promise.resolve()
}

export const identityValid = (rule, value) => {
  const regex = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/g
  if (value && !regex.test(value)) {
    return Promise.reject(new Error('身份证号应由15或18位数字+大写字母组成'))
  }
  return Promise.resolve()
}

// 校验号码（手机和区号+座机）
export const contactValid = (_, value) => {
  if (value) {
    const isOk =
      /^(?:(?:\d{3}-)?\d{8}|^(?:\d{4}-)?\d{7,8})(?:-\d+)?$/.test(value) ||
      phoneValidRegx.test(value)
    return isOk
      ? Promise.resolve()
      : Promise.reject(new Error('请输入正确格式！'))
  }
  return Promise.resolve()
}
// 校验手机号
export const phoneValid = (_, value) => {
  if (value) {
    const isOk = phoneValidRegx.test(value)
    return isOk
      ? Promise.resolve()
      : Promise.reject(new Error('请输入正确手机号码！'))
  }
  return Promise.resolve()
}
// 校验号码（暂时不校验号码是否存在  只校验只能填数字，12位以内）
export const contactNumberValid = (_, value) => {
  if (value) {
    const isOk = /^\d*$/.test(value) && value.length <= 12
    return isOk
      ? Promise.resolve()
      : Promise.reject(new Error('只能填数字，12位以内!'))
  }
  return Promise.resolve()
}

// 校验密码
export const passwordValid = (_, value) => {
  if (!value) return Promise.reject(new Error('密码不能为空！'))
  if (value) {
    const isOk = /^(?![A-Za-z]+$)(?![A-Z\d]+$)(?![A-Z\W]+$)(?![a-z\d]+$)(?![a-z\W]+$)(?![\d\W]+$)\S{8,20}$/.test(
      value
    )
    return isOk
      ? Promise.resolve()
      : Promise.reject(
          new Error('8-20位，包含数字、大小写字母、特殊字符三种类型以上')
        )
  }
  return Promise.resolve()
}

// 校验用户名
export const userNameValid = (_, value) => {
  if (!value) return Promise.reject(new Error('用户名不能为空！'))
  if (value) {
    const isOk = /^[A-Za-z0-9]{1,20}$/.test(value)
    return isOk
      ? Promise.resolve()
      : Promise.reject(new Error('只支持大小写英文字母和数字，长度限制为20'))
  }
  return Promise.resolve()
}

// 校验真实用户名
export const realNameValid = (_, value) => {
  if (!value) return Promise.reject(new Error('姓名不能为空！'))
  if (value) {
    const isOk = /^[\u4e00-\u9fa5_a-zA-Z]{1,20}$/.test(value)
    return isOk
      ? Promise.resolve()
      : Promise.reject(new Error('只支持中文和英文，长度限制为20'))
  }
  return Promise.resolve()
}

// 权限码校验
export const menuCodeValid = (_, value) => {
  if (!value) return Promise.reject(new Error('权限码不能为空！'))
  if (value) {
    const isOk = /^[A-Za-z_]{1,50}$/.test(value)
    return isOk
      ? Promise.resolve()
      : Promise.reject(new Error('只支持大小写英文字母和_，长度限制为50'))
  }
  return Promise.resolve()
}

// 校验设备序列号
export const deviceNoValid = (_, value) => {
  if (!value) return Promise.reject(new Error('设备序列号不能为空！'))
  if (value) {
    const isOk = /^[a-zA-Z\d~`!@#$%*()<>:;'"\\{}/?,._\-+=|&]{1,30}$/.test(value)
    return isOk
      ? Promise.resolve()
      : Promise.reject(
          new Error(
            '仅支持英文（大小写）、数字和符号，不支持中文，长度限制为30'
          )
        )
  }
  return Promise.resolve()
}

// 纳税人识别号
export const txIdNumValid = (_, value) => {
  if (value) {
    const isOk = /[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}/.test(
      value
    )
    return isOk ? Promise.resolve() : Promise.reject(new Error('格式错误'))
  }
  return Promise.resolve()
}
