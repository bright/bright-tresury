import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            color: theme.palette.text.hint,
            fontSize: '12px',
        },
    }),
);

interface Props {
    value: string
}

export const Placeholder: React.FC<Props> = ({value}) => {
    const classes = useStyles()
    return <div className={classes.root}>
        {value}
    </div>
}
