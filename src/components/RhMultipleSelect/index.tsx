import { uniqByField } from '@/utils/mylodash'
import { Popup } from '@taroify/core'
import { Button, View } from '@tarojs/components'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useMemo,
} from 'react'
import { SelectNode } from './node'
import './styles/index.less'

// type NodeOption = {
//   ViewField: string;
//   valueField: string;
//   childrenField: string;
// }

// type MultipleSelectType = {
//   open: boolean;
//   treeNode: any[];
//   selectList: any[];
//   nodeOption: NodeOption
// }
const FALSE = false
const TRUE = true

const RhMultipleSelect = (props, ref) => {
  const {
    treeNode = [],
    selectList = [],
    nodeOption = {
      labelField: 'name',
      valueField: 'id',
      childrenField: 'children',
    },
    children,
  } = props

  const [open, setOpen] = useState(false)
  const [tree, setTree] = useState([])
  const listRef = useRef([]) // 同步记录选择情况
  const [list, setList] = useState([])
  const [treeStack, setTreeStack] = useState([{}])
  const numRef = useRef({ newNum: 0, oldNum: 0 })

  const init = () => {
    checkAllChoose(treeNode)
  }

  useEffect(() => {
    if (treeNode && treeNode.length) {
      setTree(treeNode)
    }
  }, [])

  useEffect(() => {
    if (selectList && selectList.length) {
      setList(selectList)
      listRef.current = selectList
      init()
    }
  }, [selectList])

  useImperativeHandle(ref, () => ({
    setOpen,
  }))

  const checkSum = (id) => {
    const { childrenField, labelField, valueField } = nodeOption
    const listTemp = listRef.current
    for (let i = 0; i < listTemp.length; ++i) {
      if (id === listTemp[i][valueField]) {
        numRef.current.oldNum++
        break
      }
    }
  }

  const computAllNumber = (arr) => {
    const { childrenField, labelField, valueField } = nodeOption
    for (let j = 0; j < arr.length; j++) {
      const item = arr[j]
      checkSum(item[valueField])
      if (item[childrenField] && item[childrenField].length) {
        computAllNumber(item[childrenField])
      } else {
        numRef.current.newNum++
      }
    }
  }

  const checkAllChoose = (treeTemp) => {
    const { childrenField, labelField, valueField } = nodeOption
    // const treeTemp = t ? t : [...tree]
    treeTemp.forEach((item, i) => {
      if (item[childrenField] && item[childrenField]?.length) {
        // item.qx = FALSE
        // item.bx = FALSE
        computAllNumber(item[childrenField])
        // console.log(this.newNum,this.oldNum)
        if (numRef.current.newNum !== 0 && numRef.current.oldNum !== 0) {
          if (numRef.current.newNum == numRef.current.oldNum) {
            item.qx = TRUE
            item.bx = FALSE
          } else {
            item.qx = FALSE
            item.bx = TRUE
          }
        }
        if (numRef.current.newNum != 0 && numRef.current.oldNum == 0) {
          item.qx = FALSE
          item.bx = FALSE
        }
        numRef.current.newNum = 0
        numRef.current.oldNum = 0
      } else {
        item.qx = listRef.current.some(
          (l) => l[valueField] === item[valueField]
        )
          ? TRUE
          : FALSE
      }
    })
    setTree(treeTemp)
  }

  // 获取路径
  const getPath = () => {
    const { childrenField, labelField, valueField } = nodeOption
    const path = [...treeStack].map((b) => {
      const item = Object.assign({}, b)
      delete item[childrenField]
      return item
    })
    return path.slice(1, path.length) || []
  }

  // 取消下一级的选中
  const getIdBydelete = (arr, addList) => {
    let listTemp = addList || [...list]
    const { childrenField, labelField, valueField } = nodeOption
    arr.forEach((item) => {
      item.qx = FALSE
      item.bx = FALSE
      if (item[childrenField] && item[childrenField]?.length) {
        // getIdBydelete(item[childrenField])
        listTemp = getIdBydelete(item[childrenField], listTemp)
      } else {
        listTemp = listTemp.filter((b) => b[valueField] !== item[valueField])
      }
    })
    return listTemp
  }

  // 关联下一级,选中
  const chooseChild = (arr, path) => {
    const { childrenField, labelField, valueField } = nodeOption
    let listTemp = [...list]
    const oldPath = [...path]
    for (var i = 0, len = arr.length; i < len; ++i) {
      let item = arr[i]
      item.qx = TRUE
      item.bx = FALSE
      if (item[childrenField] && item[childrenField]?.length) {
        const newItem = { ...item }
        // delete newItem[childrenField]
        const newPath = [...oldPath, newItem]
        listTemp = [
          ...listTemp,
          // { ...item, path: oldPath },
          ...chooseChild(item[childrenField], newPath),
        ]
      } else {
        listTemp.push({ ...item, path: oldPath })
      }
    }
    return listTemp
  }

  //多选
  const checkboxChange = (item, index, bx, qx) => {
    const { childrenField, labelField, valueField } = nodeOption
    let listTemp = [...list]
    let findIdex = listTemp.findIndex((b) => item[valueField] == b[valueField])
    const path = getPath()
    if (findIdex > -1) {
      // 反选
      // 关联子级
      if (!item[childrenField]) {
        item.qx = FALSE
        item.bx = FALSE
        listTemp = listTemp.filter((b) => b[valueField] !== item[valueField])
      } else {
        // 取消所有下一级
        listTemp = getIdBydelete(item[childrenField])
      }
    } else {
      //选中
      if (item[childrenField] && item[childrenField]?.length) {
        //选中下一级
        if (qx || bx) {
          //取消下级
          listTemp = getIdBydelete(item[childrenField])
          item.qx = FALSE
          item.bx = FALSE
        } else {
          item.qx = TRUE
          item.bx = FALSE
          const { id, name } = item
          const newObj = {
            id,
            name,
            [childrenField]: item[childrenField],
          }
          const pathList =
            treeStack.length === 1 ? [newObj, ...path] : [...path, newObj]
          listTemp = chooseChild(item[childrenField], pathList)
        }
      } else {
        item.qx = TRUE
        item.bx = FALSE
        listTemp.push(item)
      }
    }
    listRef.current = uniqByField(listTemp, 'code')
    setList(listRef.current)
  }

  const toChildren = (item) => {
    const { childrenField, labelField, valueField } = nodeOption
    let child = item[childrenField]
    if (!child) return
    if (child.length > 0 && !(treeStack[0][valueField] === item[valueField])) {
      setTree(child)
      setTreeStack([...treeStack, item])
    }
    checkAllChoose(child)
  }

  //返回其它层
  const backTree = (item, index) => {
    const { childrenField, labelField, valueField } = nodeOption
    let treeStackTemp = [...treeStack]
    const max = 300
    if (index === -1) {
      treeStackTemp.splice(1, max)
    } else {
      if (treeStackTemp.length - index > 2) {
        treeStackTemp.splice(index + 1, max)
      } else if (index !== treeStackTemp.length - 1) {
        treeStackTemp.splice(treeStackTemp.length - 1, 1)
      }
    }
    const treeTemp = item?.[childrenField] || treeNode
    setTree(item?.[childrenField] || treeNode)
    setTreeStack(treeStackTemp)
    checkAllChoose(treeTemp)
  }

  const handleClick = (item) => {
    let child = item[nodeOption['childrenField']]
    if (child && child.length > 0) {
      toChildren(item)
    }
  }

  const handleClose = useCallback(() => {
    setTree(treeNode)
    setTreeStack([{}])
    setOpen(false)
  }, [treeNode])

  const handleChange = useCallback(() => {
    handleClose()
    props?.onChange(list)
  }, [list])

  const SelectWrapRender = () => {
    const { childrenField, labelField, valueField } = nodeOption
    return (
      <View className='select-content' ref={ref}>
        <View className='header'>
          <View className='title'>
            {treeStack.map((item, index) => {
              return (
                <View className='inline-item' key={item[valueField]}>
                  {index === 0 ? (
                    <View
                      className='inline-item'
                      onClick={() => backTree(item, -1)}
                    >
                      <View
                        className={
                          index === treeStack.length - 1 ? 'none' : 'active'
                        }
                      >
                        全部
                      </View>
                    </View>
                  ) : (
                    <View
                      className='inline-item'
                      onClick={() => backTree(item, index)}
                    >
                      <View className='iconfont icon-arrow-right iconclass' />
                      <View
                        className={`inline-item ${
                          index === treeStack.length - 1 ? 'none' : 'active'
                        }`}
                      >
                        {item[labelField]}
                      </View>
                    </View>
                  )}
                </View>
              )
            })}
          </View>
        </View>
        <View className='container-list'>
          {tree.map((item, index) => {
            return (
              <View
                className='common'
                onClick={() => handleClick(item)}
                key={item[valueField]}
              >
                <View className='content'>
                  <View className='list-item'>
                    <SelectNode
                      item={item}
                      currList={list}
                      keyCode={valueField}
                      onItemClick={checkboxChange}
                    />
                  </View>
                  <View className='lable-text'>{item[labelField]}</View>
                  <View className='right'>
                    {item[childrenField] &&
                      item?.[childrenField]['length'] > 0 && (
                        <View className='iconfont icon-arrow-right iconclass'></View>
                      )}
                  </View>
                </View>
              </View>
            )
          })}
        </View>
        <Button className='operate' onClick={handleChange}>
          确 定
        </Button>
      </View>
    )
  }

  return (
    <View className='multiple-select'>
      {children ? (
        children
      ) : (
        <View onClick={() => setOpen(true)}>打开多选组件</View>
      )}
      <Popup
        className='select-popup'
        open={open}
        rounded
        placement='bottom'
        onClose={handleClose}
      >
        <Popup.Close />
        {SelectWrapRender()}
      </Popup>
    </View>
  )
}

export default forwardRef(RhMultipleSelect)
