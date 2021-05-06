import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import React from 'react';
import {useTranslation} from "react-i18next";
import errorSrc from "../../../assets/error.svg";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: '14px 24px',
            fontWeight: 'bold',
            color: theme.palette.warning.main,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
        image: {
            marginRight: '14px'
        }
    }),
);

const EmailVerifyErrorMenuItem = () => {
    const {t} = useTranslation()
    const classes = useStyles()

    return <div className={classes.root} >
        <img className={classes.image} src={errorSrc} alt={t('topBar.account.emailVerificationNeeded')}/>
        {t('topBar.account.emailVerificationNeeded')}
    </div>
}

export default EmailVerifyErrorMenuItem
