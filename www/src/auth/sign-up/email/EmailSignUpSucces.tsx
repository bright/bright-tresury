import {Typography} from "@material-ui/core";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import React from "react";
import {useTranslation} from "react-i18next";
import emailSignUpSuccess from "../../../assets/email_signup_success.svg";
import {SignUpSuccess} from "../common/SignUpSuccess";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        },
        subtitle: {
            marginTop: '36px',
            fontSize: '14px',
        },
        image: {
            marginTop: '64px',
        },
    }),
);

const EmailSignUpSuccess: React.FC = () => {
    const classes = useStyles()
    const {t} = useTranslation()

    return <SignUpSuccess successImg={emailSignUpSuccess}>
        <Typography className={classes.subtitle}>{t('auth.signUp.emailSignUp.form.successSubtitle')}</Typography>
    </SignUpSuccess>
}

export default EmailSignUpSuccess
