import {createStyles, makeStyles} from "@material-ui/core/styles";
import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: '100%',
            textAlign: 'center',
            marginTop: '36px',
        },
    })
)

export const Loader = () => {
    const classes = useStyles()
    return <div className={classes.root}>
        <CircularProgress color="secondary"/>
    </div>
};

