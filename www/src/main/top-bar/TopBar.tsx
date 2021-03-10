import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import React from 'react';
import {useAuth} from "../../auth/AuthContext";
import config from "../../config/index";
import {breakpoints} from "../../theme/theme";
import AccountInfo from "./account/AccountInfo";
import NetworkPicker from "./NetworkPicker";
import SignInButton from "./SignInButton";

export const tabletTopBarHeight = '77px'
export const desktopTopBarHeight = '68px'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            height: desktopTopBarHeight,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                height: tabletTopBarHeight
            },
            padding: '0 36px',
            backgroundColor: config.NETWORK_COLOR,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        }
    }),
);

const TopBar: React.FC = () => {
    const classes = useStyles();
    const {isUserSignedIn} = useAuth()

    return <div className={classes.root}>
        <NetworkPicker/>
        {isUserSignedIn ? <AccountInfo/> : <SignInButton/>}
    </div>
}

export default TopBar
