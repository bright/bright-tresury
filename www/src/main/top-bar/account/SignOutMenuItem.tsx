import {createStyles, makeStyles} from "@material-ui/core/styles";
import React from 'react';
import {useTranslation} from "react-i18next";
import lockSrc from "../../../assets/lock.svg";
import {useSignOut} from "../../../auth/auth.api";
import {useAuth} from "../../../auth/AuthContext";
import MenuItem from "./MenuItem";

const useStyles = makeStyles(() =>
    createStyles({
        image: {
            marginRight: '14px'
        }
    }),
);

const SignOutMenuItem = () => {
    const {t} = useTranslation()
    const classes = useStyles();

    const {setIsUserSignedIn} = useAuth()
    const {mutateAsync, isLoading} = useSignOut()

    const onClick = async () => {
        await mutateAsync({}, {
            onSuccess: () => setIsUserSignedIn(false)
        })
    }

    return <MenuItem onClick={onClick} disabled={isLoading}>
        <img className={classes.image} src={lockSrc} alt={t('topBar.account.signOut')}/>
        {t('topBar.account.signOut')}
    </MenuItem>
}

export default SignOutMenuItem
