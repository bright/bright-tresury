import React, {useMemo, useState} from "react";
import hidePasswordIcon from "../../../assets/hide_password.svg";
import showPasswordIcon from "../../../assets/show_password.svg";
import {Input, InputProps} from "../Input";
import {PasswordLabel} from "./PasswordLabel";

interface OwnProps {
    label: string
}

export type PasswordInputProps = OwnProps & Omit<InputProps, "label">

export const PasswordInput: React.FC<PasswordInputProps> = ({label, ...props}) => {

    const [show, setShow] = useState(false)

    const icon = useMemo(() => show ? showPasswordIcon : hidePasswordIcon, [show])
    const type = useMemo(() => show ? "text" : "password", [show])
    const toggleShow = () => setShow(!show)

    return <Input
        label={<PasswordLabel label={label} icon={icon} onClick={toggleShow}/>}
        type={type}
        {...props} />
}
