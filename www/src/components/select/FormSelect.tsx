import { useField } from 'formik'
import React from 'react'
import { TextFieldStylesProps, useTextFieldStyles } from '../form/input/textFieldStyles'
import Select, { SelectProps } from './Select'

interface OwnProps {}

export type FormSelectProps = OwnProps & SelectProps & TextFieldStylesProps

const FormSelect = ({ colorScheme, ...props }: FormSelectProps) => {
    const textFieldClasses = useTextFieldStyles({ colorScheme })()
    // @ts-ignore
    const [field, meta] = useField({ ...props, type: 'input' })
    return (
        <Select
            {...props}
            inputProps={{
                ...field,
                ...meta,
                classes: {
                    select: textFieldClasses.input,
                    root: textFieldClasses.root,
                },
            }}
        />
    )
}

export default FormSelect
