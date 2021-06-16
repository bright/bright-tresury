import { useField } from 'formik'
import React from 'react'
import Select, { SelectProps } from './Select'

const FormSelect = ({ ...props }: SelectProps) => {
    // @ts-ignore
    const [field, meta] = useField({ ...props, type: 'input' })
    return <Select {...props} inputProps={{ ...field, ...meta }} />
}

export default FormSelect
