import {TextFieldProps} from "@material-ui/core";
import FormGroup from "@material-ui/core/FormGroup";
import {useField} from "formik";
import React, {useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import hidePasswordIcon from "../../../../assets/hide_password.svg";
import showPasswordIcon from "../../../../assets/show_password.svg";
import {TextField} from "../TextField";
import {PasswordLabel} from "./PasswordLabel";
import {ValidationRuleLabel} from "./ValidationRuleLabel";

interface OwnProps {
    label?: string
    validationRules?: string[]
}

export type PasswordInputProps = OwnProps & Omit<TextFieldProps, "label">

export const PasswordInput: React.FC<PasswordInputProps> = ({label, validationRules, name = '', ...props}) => {
    const {t} = useTranslation()
    const [show, setShow] = useState(false)
    const [field, meta] = useField(name);

    const hasError = meta.touched && !!meta.error
    const showValidationRules = (field.value !== meta.initialValue) || meta.touched

    const icon = useMemo(() => show ? showPasswordIcon : hidePasswordIcon, [show])
    const iconDescription = useMemo(() => show ? t('auth.passwordShow') : t('auth.passwordHide'), [show, t])
    const type = useMemo(() => show ? "text" : "password", [show])

    const toggleShow = () => setShow(!show)

    return <FormGroup>
        {label ? <PasswordLabel label={label} icon={icon} iconDescription={iconDescription} onClick={toggleShow}/> : null}
        <TextField
            {...props}
            type={type}
            error={hasError}
            inputProps={{...field, ...meta}}
        />
        {!!validationRules && showValidationRules && validationRules.map((error) => {
            return <ValidationRuleLabel message={error} error={meta?.error}/>
        })}
    </FormGroup>
}
