import {Button as MaterialButton, ButtonProps as MaterialButtonProps, createStyles} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles(() => createStyles({
    root: {
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: '6px',
        padding: '.5em 2em .5em 2em'
    },
    contained: {
        backgroundColor: '#0E65F2',
        color: 'white',
    },
    outlined: {
        borderColor: '#0E65F2',
        color: '#0E65F2',
    },
    text: {
        color: '#0E65F2',
    }
}))

interface ButtonProps {
    variant?: ButtonVariant
}

export const Button: React.FC<ButtonProps & MaterialButtonProps> = ({children, variant, ...props}) => {
    const classes = useStyles()
    return <MaterialButton
        {...props}
        classes={classes}
        variant={variant ?? "contained"}>
        {children}
    </MaterialButton>
}

export type ButtonVariant = "contained" | "outlined" | "text"
