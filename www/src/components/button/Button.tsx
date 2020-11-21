import {Button as MaterialButton, createStyles} from "@material-ui/core";
import {makeStyles, styled} from "@material-ui/core/styles";
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
        borderWidth: '2px',
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
        className={classes.button}
        classes={{
            contained: classes.buttonContained,
            outlined: classes.buttonOutlined
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

