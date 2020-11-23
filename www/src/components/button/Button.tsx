import {Button as MaterialButton, createStyles} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles(() => createStyles({
    button: {
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: '6px',
        padding: '.5em 2em .5em 2em'
    },
    buttonContained: {
        backgroundColor: '#0E65F2',
        color: 'white',
    },
    buttonOutlined: {
        borderColor: '#0E65F2',
        color: '#0E65F2',
    },
    buttonText: {
        color: '#0E65F2',
    }
}))

interface ButtonProps {
    variant?: ButtonVariant
}

export const Button: React.FC<ButtonProps & React.PropsWithChildren<any>> = ({...props}) => {
    const classes = useStyles()
    return <MaterialButton
        {...props}
        classes={{
            root: classes.button,
            contained: classes.buttonContained,
            outlined: classes.buttonOutlined,
            text: classes.buttonText
        }}
        variant={props.variant ? props.variant : ButtonVariant.Contained}>
        {props.children}
    </MaterialButton>
}

export enum ButtonVariant {
    Contained = "contained",
    Outlined = "outlined",
    Text = "text"
}

