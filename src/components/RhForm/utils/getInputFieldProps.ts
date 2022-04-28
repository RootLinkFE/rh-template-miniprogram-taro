import { isNumber } from '@/utils/mylodash'

/**
 * @param props
 * @returns
 */
export function getInputFieldProps(props) {
  const { max, placeholder, label } = props
  const placeholderLabel = placeholder || `请输入${label}`
  const maxLength = max && isNumber(max) ? max : undefined

  return {
    maxLength,
    placeholder: placeholderLabel
  }
}
