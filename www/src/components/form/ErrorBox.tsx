import {createStyles, Theme, Typography, TypographyProps} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: '#FF00002C',
            borderRadius: '2px',
            color: theme.palette.error.main,
            padding: '1em',
            fontSize: '14px',
            fontWeight: 'bold',
            textAlign: 'center',
        }
    }),
);

interface OwnProps {
    error: string
}

export type ErrorBoxProps = OwnProps & TypographyProps

export const ErrorBox: React.FC<ErrorBoxProps> = ({error, className, ...props}) => {
    const classes = useStyles()

    return <Typography
        {...props}
        className={`${classes.root} ${className}`}>
        {error}
    </Typography>
}
