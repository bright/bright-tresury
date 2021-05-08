import {createStyles, fade, Theme, Typography, TypographyProps} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import React from "react";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            borderRadius: '2px',
            padding: '1em',
            fontSize: '14px',
            fontWeight: 'bold',
            textAlign: 'center',
        },
        error: {
            backgroundColor: '#FF00002C',
            color: theme.palette.error.main,
        },
        info: {
            backgroundColor: fade(theme.palette.primary.main, 0.3),
            color: theme.palette.primary.main,
        }
    }),
);

type InfoLevel = 'error' | 'info'

interface OwnProps {
    message: string,
    level: InfoLevel
}

export type InfoBoxProps = OwnProps & TypographyProps

export const InfoBox: React.FC<InfoBoxProps> = ({message, level = 'info', className, ...props}) => {
    const classes = useStyles()

    return <Typography
        {...props}
        className={clsx(classes.root, className, level === 'error' ? classes.error : classes.info)}>
        {message}
    </Typography>
}
