import {
    createStyles,
    FormGroup,
    InputLabel,
    MenuItem,
    Select as MaterialSelect,
    SelectProps as MaterialSelectProps
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import React from "react";
import {useField} from "formik";
import {FieldInputProps, FieldMetaProps} from "formik/dist/types";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            padding: '0'
        },
        label: {
            marginBottom: '1em',
            color: '#1B1D1C',
            fontSize: '0.75em',
        },
        select: {
            fontSize: '0.875em',
            padding: '1em',
            fontWeight: 500,
        },
    }),
);

interface SelectProps<T> {
    value: T
    options: T[]
    label?: string
    placeholder?: string
    renderOption?: (value: T) => string,
    disableFormik?: boolean
}

export const Select: ISelect = ({disableFormik, ...props}) => {
    return disableFormik ? <SelectComponent {...props}/> : <FormikSelectComponent {...props}/>
}

export type ISelect<T = any> = React.FC<SelectProps<T> & MaterialSelectProps>

const FormikSelectComponent: ISelect = ({...props}) => {
    // @ts-ignore
    const [field, meta] = useField({...props, type: 'input'});
    return <SelectComponent
        {...props}
        inputProps={{...field, ...meta}}
    />
}

const SelectComponent: ISelect = ({inputProps, disableFormik, value, renderOption, options, label, placeholder, ...props}) => {
    const classes = useStyles()
    return <FormGroup>
        {label ? <InputLabel className={classes.label}>{label}</InputLabel> : null}
        <MaterialSelect
            {...props}
            value={value ? value : ''}
            disableUnderline={true}
            inputProps={{
                classes: {
                    select: classes.select
                },
                ...inputProps
            }}>
            {placeholder ? <MenuItem value={''}>{placeholder}</MenuItem> : null}
            {options ? options.map((option: any, index: number) =>
                <MenuItem key={index} value={option}>
                    {renderOption ? renderOption(option) : option}
                </MenuItem>
            ) : null}
        </MaterialSelect>
    </FormGroup>
}
