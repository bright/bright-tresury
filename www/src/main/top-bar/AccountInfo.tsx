import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import React from 'react';
import signInSrc from "../../assets/caution.svg";
import {useAuth} from "../../auth/AuthContext";
import TopBarButton from "./TopBarButton";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
        }
    }),
);

const AccountInfo: React.FC = () => {
    const classes = useStyles();

    const {signOut} = useAuth()

    const onClick = () => signOut()

    return <div className={classes.root}>
        <TopBarButton alt={'sign out'} svg={signInSrc} onClick={onClick}/>
    </div>
}

export default AccountInfo
