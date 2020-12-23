import {useField} from "formik";
import React from "react";
import {ISelect, Select} from "./Select";

export const FormSelect: ISelect = ({...props}) => {
    // @ts-ignore
    const [field, meta] = useField({...props, type: 'input'});
    return <Select
        {...props}
        inputProps={{...field, ...meta}}
    />
}
