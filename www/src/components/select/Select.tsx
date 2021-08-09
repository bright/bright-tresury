import {
    createStyles,
    FormGroup,
    InputLabel,
    MenuItem,
    Select as MaterialSelect,
    SelectProps as MaterialSelectProps,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { TextFieldStylesProps, useTextFieldStyles } from '../form/input/textFieldStyles'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            padding: '0',
        },
        label: {
            marginBottom: '1em',
            color: '#1B1D1C',
            fontSize: '0.75em',
        },
    }),
)

interface OwnProps<T> {
    value?: T
    options: T[]
    label?: string
    placeholder?: string
    renderOption?: (value: T) => string | JSX.Element
}

export type SelectProps<T = any> = OwnProps<T> & MaterialSelectProps & TextFieldStylesProps

const Select = ({
    inputProps,
    value,
    renderOption,
    options,
    label,
    placeholder,
    colorScheme,
    ...props
}: SelectProps) => {
    const classes = useStyles()
    const textFieldClasses = useTextFieldStyles({ colorScheme })()
    return (
        <FormGroup>
            {label ? <InputLabel className={classes.label}>{label}</InputLabel> : null}
            <MaterialSelect
                {...props}
                value={value ? value : ''}
                disableUnderline={true}
                inputProps={{
                    classes: {
                        select: textFieldClasses.input,
                        root: textFieldClasses.root,
                    },
                    ...inputProps,
                }}
            >
                {placeholder ? <MenuItem value={''}>{placeholder}</MenuItem> : null}
                {options
                    ? options.map((option: any, index: number) => (
                          <MenuItem key={index} value={option}>
                              {renderOption ? renderOption(option) : option}
                          </MenuItem>
                      ))
                    : null}
            </MaterialSelect>
        </FormGroup>
    )
}

export default Select
