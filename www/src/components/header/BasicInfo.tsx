import {createStyles, makeStyles} from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            order: 1,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginBottom: '24px',
        },
    }))

export const BasicInfo: React.FC = ({children}) => {
    const classes = useStyles()
    return <div className={classes.root}>
        {children}
    </div>
}
