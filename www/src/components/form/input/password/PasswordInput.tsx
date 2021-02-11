import FormGroup from "@material-ui/core/FormGroup";
import {useField} from "formik";
import React, {useMemo, useState} from "react";
import hidePasswordIcon from "../../../../assets/hide_password.svg";
import showPasswordIcon from "../../../../assets/show_password.svg";
import {InputProps} from "../Input";
import {TextField} from "../TextField";
import {PasswordLabel} from "./PasswordLabel";
import {ValidationRuleLabel} from "./ValidationRuleLabel";

interface OwnProps {
    label: string
    validationRules: string[]
}

export type PasswordInputProps = OwnProps & Omit<InputProps, "label">

export const PasswordInput: React.FC<PasswordInputProps> = ({label, validationRules, name = '', ...props}) => {
    const [show, setShow] = useState(false)
    const [field, meta] = useField(name);

    /*
     * Formik does not support multiple errors
     * Custom validate function returns an array of errors which needs to be handled manually
     */
    const errors = Array.isArray(meta?.error) ? [...(meta.error)] : []

    const hasError = meta.touched && errors && errors.length > 0
    const showValidationRules = (field.value !== meta.initialValue) || meta.touched

    const icon = useMemo(() => show ? showPasswordIcon : hidePasswordIcon, [show])
    const type = useMemo(() => show ? "text" : "password", [show])

    const toggleShow = () => setShow(!show)

    return <FormGroup>
        <PasswordLabel label={label} icon={icon} onClick={toggleShow}/>
        <TextField
            type={type}
            {...props}
            error={hasError}
            inputProps={{...field, ...meta}}
        />
        {showValidationRules && validationRules.map((error) => {
            return <ValidationRuleLabel message={error} isError={errors.includes(error)}/>
        })}
    </FormGroup>
}
