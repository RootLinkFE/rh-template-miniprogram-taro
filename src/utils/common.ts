import classNames from 'classnames'
import {
  isNumber,
  isBoolean,
  isNil,
  isString,
  _isEmpty,
  isObject,
  flatten
} from './mylodash'
import dayjs from "dayjs";

export const noop = () => {}

// null=> true
// true=> true
// 1 => false
// [1,2]=> false
// {} => true
// {a:'1'} => false
export const isEmpty = (value) => {
  if (isNumber(value) || isBoolean(value)) {
    return false
  }
  if (isNil(value)) {
    return true
  }
  if (isString(value)) {
    return value.length === 0
  }
  return _isEmpty(value)
}
export const isNotEmpty = (value) => {
  return !isEmpty(value)
}
export const toBoolean = (value) => {
  if (isEmpty(value)) {
    return false
  }
  if (isString(value)) {
    const p = value.toLowerCase().trim()
    if (p === 'true') {
      return true
    }
    if (p === 'false') {
      return false
    }
  }
  return value
}

export function parseJSON(json) {
  if (isObject(json)) {
    return json
  }
  if (isString(json)) {
    try {
      return JSON.parse(json)
    } catch (e) {
      return {}
    }
  }
  console.warn('shouldBeObject is not controlled value', json)
  return json
}

/**
 *
 * mode
 *
 * @returns {{mode: (function(*=): (*)), classNames: (function(*=, ...[*]=): string)}}
 */
export function getExtMode(...props) {
  const modeList = flatten(props).filter(isNotEmpty)

  const buildWithPrefix = (prefix) => {
    if (isEmpty(prefix)) {
      return prefix
    }
    const list = modeList.map((it) => {
      if (isObject(it)) {
        return Object.keys(it).map((key) => (it[key] ? key : ''))
      }
      return it
    })
    return flatten(list)
      .filter((it) => isNotEmpty(it))
      .map((it) => `${prefix}--${it.trim()}`)
  }

  return {
    mode: buildWithPrefix,
    classNames: function(prefix, ...others) {
      return classNames(prefix, others, buildWithPrefix(prefix))
    }
  }
}

export const debounce = (fn, ms = 0) => {
  let timeoutId
  return function(...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), ms)
  }
}

/**
 * try/catch helper
 * @param {Promise} promise
 */
export async function promiseHandle(promise) {
  try {
    const result = await promise
    return [null, result]
  } catch (err) {
    return [err, null]
  }
}

export const throttle = (fun, delay) => {
  let last = 0
  return (...params) => {
    const now = +new Date()
    if (now - last > delay) {
      fun.apply(this, params)
      last = now
    }
  }
}

export const refactorTree = (tree, config = {}) => {
  const {
    labelField = 'label',
    valueField = 'value',
    childrenField = 'children',
    currLabel = 'name',
    currValue = 'id',
    currchildren = 'subNode'
  } = config
  const deepFn = (arr) => {
    return arr.map((b) => {
      b = {
        [labelField]: b[currLabel],
        [valueField]: b[currValue],
        ...b
      }
      if (b?.[currchildren]) {
        b[childrenField] = deepFn(b[currchildren])
      }
      return b
    })
  }
  return deepFn(tree)
}

/** 树形转换
 * @param {data} 原始数据
 * @param {config} {code: 唯一值, parentCode: 父id, children: 子结构名称}
 */
export const toTree = (data, config = {}) => {
  let code = config.code || 'code',
    parentCode = config.parentCode || 'parentCode',
    parentValue = config.parentValue || '',
    children = config.children || 'children',
    idMap = {},
    jsonTree = []

  data.forEach(function(v) {
    idMap[v[code]] = v
  })

  data.forEach(function(v) {
    let parent = idMap[v[parentCode]]
    if (parent && parent !== parentValue) {
      !parent[children] && (parent[children] = [])
      parent[children].push(v)
    } else {
      jsonTree.push(v)
    }
  })

  return jsonTree
}

export const sleep = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time))
}

/* 移除数组中的某个元素 */
export const removeItem = (list = [], item) => {
  for (let i = 0, l = list.length; i < l; i++) {
    if (item === list[i]) {
      list.splice(i, 1)
      i--
      l--
    }
  }
  return [...list]
}

export const isPromise = (val) => {
  return (
    !isNil(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * 获取url参数
 * @param {*} url
 * @returns object
 */
export const getQueryObject = (url) => {
  const search = url
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, key, value) => {
    const name = decodeURIComponent(key)
    let val = decodeURIComponent(value)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * 获取格式化日期时间
 */
 export const getFormatTime = (value, type) => {
  if (value)
    switch (type) {
      case "date":
        return dayjs(value).format("YYYY-MM-DD");
      case "time":
        return dayjs(value).format("HH:mm:ss");
      case "datetime":
        return dayjs(value).format("YYYY-MM-DD HH:mm:ss");
      case "date-hour":
        return dayjs(value).format("YYYY-MM-DD HH");
      case "month-day":
        return dayjs(value).format("MM-DD");
      case "year-month":
        return dayjs(value).format("YYYY-MM");
      default:
        return dayjs(value).format("YYYY-MM-DD");
    }
  return;
};