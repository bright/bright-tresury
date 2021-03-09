import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import React from 'react';

import {breakpoints} from "../theme/theme";
import TopBar from "./top-bar/TopBar";
import Menu from "./menu/Menu";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            height: '100%',

        },
        dashboard: {
            display: 'flex',
            flexDirection: 'row',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                flexDirection: 'column'
            },
        }
    }),
);

const Main: React.FC = ({children}) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <TopBar/>
            <div className={classes.dashboard}>
                <Menu/>
                {children}
            </div>
        </div>
    )
}

export default Main
