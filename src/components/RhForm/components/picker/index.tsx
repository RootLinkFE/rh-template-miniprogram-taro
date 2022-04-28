import { cloneElement } from 'react'
import NormalPicker from './NormalPicker'
import FormPickerAddr from './FormPickerAddr'

const FormPicker = NormalPicker
FormPicker.Addr = FormPickerAddr

export default FormPicker
