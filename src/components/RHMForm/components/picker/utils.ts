import { compact } from '@/utils/mylodash'

/**
 * 转换成字符串数组  ['北京市'，'北京市', '东城区']
 * @param arrs 完整的数组对象
 */
const converNameArr = (arrs) => {
  if (!arrs) return
  let arrList = [...arrs]
  let result

  result = arrList.map((arr) => {
    let temp = []
    arr &&
      arr.map((b) => {
        temp.push(b.name)
      })
    return temp
  })
  return result
}

/**
 * 提取省市区数组集合
 * @param {*} addrArr 全部地址数据
 * @param {*} codeArr 初始化的省市区code eg: ['110000', '110100', '110101'] 数组第一位不能为空，默认
 * @param {*} indexs 回显的下标值
 */
export const toArrList = (
  addrArr = [],
  codeArr = ['110000', '110100', '110101'],
  indexs = [],
  propsLevel = 2,
  level = 0, // 当前节点深度
  tempObj = { mergeName: '' }
) => {
  let itemList = [],
    nameList = []
  let rootArr = []
  let subArr = []
  let defaultCode = '110000'

  if (addrArr[0] && addrArr[0]['code'] !== defaultCode) {
    let temp = []
    addrArr.map((b, bIndex) => {
      subArr.push(b)
      if (codeArr[level] === b.code) {
        // 判断当前递归需要保存的是区还是县的值，level值对应省市区的下标志
        indexs.push(bIndex)
        tempObj.mergeName += b.name
        temp =
          propsLevel === 1
            ? []
            : b['children'] &&
              toArrList(b['children'], codeArr, indexs, propsLevel, level + 1, tempObj)
      } else {
        // if (b.level === 1) {
        //   // 如果有4级地址，此处手动改为2，目的判断
        //   if (!bIndex) {
        //   }
        // } else {
        //   temp =
        //     b['children'] &&
        //     toArrList(b['children'], codeArr, indexs, propsLevel, level + 1, tempObj)
        // }
      }
    })
    if (temp) {
      // 还有子集则与子子集一起保存
      return [subArr, temp]
    }
    return subArr // 没有子集则返回
  } else {
    addrArr.map((b, bIndex) => {
      rootArr.push(b)
      if (codeArr[0] === b.code) {
        indexs.push(bIndex)
        tempObj.mergeName += b.name
        subArr =
          propsLevel === 0
            ? []
            : b['children'] &&
              toArrList(b['children'], codeArr, indexs, propsLevel, level + 1, tempObj)
      }
    })
  }

  subArr = subArr.map((b) => {
    if (b.length) return b
  })
  itemList = compact([rootArr, ...subArr]) || []
  nameList = converNameArr(itemList) || []
  return {
    nameList,
    itemList,
    indexs,
    mergeName: tempObj.mergeName
  }
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

export const uniqAreaName = (names) => [...new Set(names)].join('')