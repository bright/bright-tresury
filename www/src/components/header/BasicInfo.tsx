import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {breakpoints} from "../../theme/theme";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            order: 1,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                paddingLeft: '1.5em',
                paddingRight: '1.5em'
            },
            marginBottom: '24px',
        },
    }))

export const BasicInfo: React.FC = ({children}) => {
    const classes = useStyles()
    return <div className={classes.root}>
        {children}
    </div>
}
