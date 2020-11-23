import {createStyles, FormGroup, InputLabel, MenuItem, Select as MaterialSelect} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            background: '#fff',
            padding: '0'
        },
        label: {
            marginBottom: '1em',
            color: '#1B1D1C',
            fontSize: '0.75em',
        },
        select: {
            fontSize: '0.875em',
            backgroundColor: '#fff',
            padding: '1em',
            fontWeight: 500
        },
    }),
);

interface SelectProps<T> {
    values: T[]
    renderValue: (value: T) => string
    label: string
}

export const Select: React.FC<SelectProps<any> & React.PropsWithChildren<any>> = ({...props}) => {
    const classes = useStyles()
    return <FormGroup>
        {props.label ? <InputLabel className={classes.label}>{props.label}</InputLabel> : null}
        <MaterialSelect
            option
            {...props}
            renderValue={props.renderValue}
            value={props.value ? props.value : ''}
            disableUnderline={true}
            inputProps={{
                classes: {
                    select: classes.select
                }
            }}
        >
            <MenuItem value="">{props.placeholder}</MenuItem>
            {props.values ? props.values.map((value: any, index: number) =>
                <MenuItem key={index} value={value}>
                    {props.renderValue(value)}
                </MenuItem>
            ) : null}
        </MaterialSelect>
    </FormGroup>
}
