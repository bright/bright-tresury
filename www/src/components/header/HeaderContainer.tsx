import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {breakpoints} from "../../theme/theme";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            background: theme.palette.background.default,
            padding: '2em 7em 2em 3em',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                padding: '1em 2.2em 1em 2.2em'
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                paddingLeft: 0,
                paddingRight: 0
            },
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap'
        },
    }))

export const HeaderContainer: React.FC = ({children}) => {
    const classes = useStyles()
    return <div className={classes.root}>
        {children}
    </div>
}
