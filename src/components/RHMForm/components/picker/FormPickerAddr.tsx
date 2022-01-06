import React, { useEffect, useRef, useState, useCallback } from 'react'
import NormalPicker from './NormalPicker'
import { toArrList, uniqAreaName } from './utils'
import { regionJSON } from './addrData'

function FormPickerAddr(props) {
  const {
    labelText = '省市区',
    value = 0,
    level = 2, // 0 省 1市 2区
    onChange = () => {},
    disabled = false,
    areaMergeName = '',
    ...formItemsProps
  } = props

  const addressArrRef = useRef([]) //记录当前的省市区对象数组
  const addressNameArrRef = useRef([]) //记录当前的省市区名字数组
  const regionsRef = useRef({ provinces: [], citys: [], areas: [] }) // 省市区
  const [multiIndex, setMultiIndex] = useState([0, 0, 0])
  const [addressMulti, setAddressMulti] = useState([])
  const [mergeName, setMergeName] = useState(areaMergeName)

  /**
   * 获取children
   * 广东省切换湖南省，arr就是省的数组，通过index找到对应的湖南省对应的children，从而更新对应的市的列
   * @param arr 上一列数组对象
   * @param index arr数组中那一个对象
   */
  const getList = (arr, index, mIndex) => {
    let tempArr = arr
    let rootArr = [],
      rootNameArr = []
    tempArr[index] &&
      tempArr[index].children.map((b) => {
        rootArr.push(b)
        rootNameArr.push(b.name)
      })
    addressArrRef.current[mIndex] = rootArr
    addressNameArrRef.current[mIndex] = rootNameArr
    return rootNameArr
  }

  // 滑动回调
  const onColumnchange = (e) => {
    const { column: mIndex, value: v } = e.detail
    switch (mIndex) {
      case 0:
        regionsRef.current = {
          citys: level >= 1 ? getList(addressArrRef.current[0], v, 1) : '', //props.level !== 3 ?
          areas: level >= 2 ? getList(addressArrRef.current[1], 0, 2) : '',
          ...regionsRef.current
        }
        setMultiIndex(level === 2 ? [v, 0, 0] : level === 1 ? [v, 0] : [v])
        break
      case 1:
        regionsRef.current = {
          areas: level >= 2 ? getList(addressArrRef.current[1], v, 2) : '',
          ...regionsRef.current
        }
        setMultiIndex(
          level === 2
            ? [multiIndex[0], v, 0]
            : level === 1
            ? [multiIndex[0], v]
            : [multiIndex[0]]
        )
        break
      case 2:
        setMultiIndex([multiIndex[0], multiIndex[1], v])
        break
      default:
        return
    }
    setAddressMulti([...addressNameArrRef.current])
  }

  // 确定事件回调
  const handleChange = (originIndexs, echoIndexs) => {
    const addrIndexs = originIndexs || echoIndexs
    let _mergeName = '',
      _echoAddrIds = []
    let result = {}
    addressArrRef.current.map((arr, index) => {
      for (let i = 0; i < arr.length; ++i) {
        if (i === addrIndexs[index]) {
          _mergeName += arr[i].name
          _echoAddrIds.push(arr[i].code)
          switch (index) {
            case 0:
              result.provinceName = arr[i].name
              result.provinceCode = arr[i].code
              break
            case 1:
              result.cityName = arr[i].name
              result.cityCode = arr[i].code
              break
            case 2:
              result.districtName = arr[i].name
              result.districtCode = arr[i].code
              break
          }
          if (level === index) {
            result = { ...result, ...arr[i], _mergeName, _echoAddrIds }
          }
          continue
        }
      }
    })
    result = { ...result, multiIndex: addrIndexs }
    setMergeName(
      uniqAreaName([result.provinceName, result.cityName, result.districtName])
    )
    props?.onChange?.(result)
  }

  const handleCancel = () => {
    // initAddress(echoAddrIds)
  }

  // 组件初始化数据
  const initAddress = async (ids) => {
    let result = regionJSON //await getAddrList();
    if (!result) return
    let addressJSON = result || []
    let { nameList, itemList, indexs, mergeName: name } = toArrList(
      addressJSON,
      ids || ['110000', '110100', '110101']
    )
    regionsRef.current = {
      provinces: (nameList && nameList[0]) || [],
      citys: (nameList && nameList[1]) || [],
      areas: (nameList && nameList[2]) || [],
      ...regionsRef.current
    }
    setAddressMulti(nameList)
    setMultiIndex(indexs)

    const _itemList = itemList || [],
      _nameList = nameList || []

    addressArrRef.current = [..._itemList]
    addressNameArrRef.current = [..._nameList]
    // 回显操作
    if (ids) {
      handleChange(null, indexs)
    }
  }

  useEffect(() => {
    let ids = props.fieldProps.echoAddrIds || []
    if (ids.length) {
      initAddress(ids)
    } else {
      initAddress()
    }
  }, [props.fieldProps.echoAddrIds])

  return (
    <NormalPicker
      labelText={labelText}
      name={mergeName}
      multiIndex={multiIndex}
      addressMulti={addressMulti}
      onSelect={handleChange}
      onCancel={handleCancel}
      onColumnchange={onColumnchange}
      disabled={disabled}
      {...formItemsProps}
    ></NormalPicker>
  )
}
FormPickerAddr.defaultProps = {
  type: 'FormControl',
  controlName: 'FormPickerAddr'
}
export default FormPickerAddr
