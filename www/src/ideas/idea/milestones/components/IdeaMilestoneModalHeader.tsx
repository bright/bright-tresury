import React from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        }
    }),
);

export const IdeaMilestoneModalHeader: React.FC = ({ children }) => {

    const classes = useStyles()

    return (
        <div className={classes.root}>
            {children}
        </div>
    )
}