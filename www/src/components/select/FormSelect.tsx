import { useField } from 'formik'
import React from 'react'
import { TextFieldStylesProps } from '../form/input/textFieldStyles'
import Select, { SelectProps } from './Select'

interface OwnProps {}

export type FormSelectProps = OwnProps & SelectProps & TextFieldStylesProps

const FormSelect = (props: FormSelectProps) => {
    // @ts-ignore
    const [field, meta] = useField({ ...props, type: 'input' })
    return <Select {...props} inputProps={{ ...field, ...meta }} />
}

export default FormSelect
