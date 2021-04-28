import React from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => createStyles({
    root: {
        marginTop: '20px',
        marginBottom: '6px',
        display: 'flex',
        justifyContent: 'space-between'
    }
}))

export const CardHeader: React.FC = ({ children }) => {

    const classes = useStyles()

    return (
        <div className={classes.root}>
            {children}
        </div>
    )
}