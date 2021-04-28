import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: '46px',
            width: '46px',
            borderRadius: '8px',
            backgroundColor: theme.palette.primary.main
        }
    }),
);

// TODO: display image from user
const Avatar = () => {
    const classes = useStyles();
    return <div className={classes.root}>
    </div>
}

export default Avatar
