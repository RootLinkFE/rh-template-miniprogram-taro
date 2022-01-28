import { _isEmpty, clampNumber, uniqByField } from '@/utils/mylodash'
import { refactorTree } from '@/utils/common'
import { ReactNode, useCallback, useEffect, useState } from 'react'

// interface CascaderColumn {
//   value?: any
//   label?: ReactNode
//   disabled?: boolean
// }

// interface CascaderOption extends CascaderColumn {
//   children?: CascaderOption[]
// }

// interface UseCascaderOptions {
//   value?: any[]
//   depth?: number
//   options: CascaderOption[]
// }

// interface CascaderObject {
//   columns: CascaderOption[][]
// }

export default function useCascader({
  value: values = [],
  depth = 0,
  options,
}) {
  depth = clampNumber(depth, 0, depth)
  const [columns, setColumns] = useState([])

  const findOption = useCallback(
    (o, value) => o.filter((option) => option.value === value)[0] || {},
    []
  )

  useEffect(() => {
    const newColumns = []
    newColumns.push(options as never)

    if (!_isEmpty(values)) {
      let cursorOptions = options

      for (const value of values) {
        const { children: nextOptions } = findOption(cursorOptions, value)
        if (!nextOptions || _isEmpty(nextOptions)) {
          break
        }
        cursorOptions = nextOptions
        newColumns.push(nextOptions as never)
      }
    }
    if (depth !== 0 && depth > newColumns.length) {
      Array.from(depth - newColumns.length)
        .map(() => [])
        .forEach((e) => newColumns.push(e))
    }
    setColumns(newColumns)
  }, [depth, findOption, options, values])

  return {
    columns
  }
}
