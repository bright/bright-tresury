import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles, InputLabel} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        label: {
            marginBottom: '8px',
            color: theme.palette.text.primary,
            fontSize: '12px',
        },
    }),
);

interface Props {
    label: string
}

export const Label: React.FC<Props> = ({label}) => {
    const classes = useStyles()
    return <InputLabel className={classes.label}>{label}</InputLabel>
}
