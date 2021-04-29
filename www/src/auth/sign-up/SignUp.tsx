import {Typography} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import React from "react";
import {Trans, useTranslation} from "react-i18next";
import Container from "../../components/form/Container";
import {RouterLink} from "../../components/link/RouterLink";
import {ROUTE_SIGNIN} from "../../routes/routes";
import { breakpoints } from "../../theme/theme";
import {signUp} from "../auth.api";
import SignUpForm from "./SignUpForm";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            alignSelf: 'center',
            width: '50%',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                width: '75%',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                paddingLeft: '1em',
                paddingRight: '1em',
                width: '100%',
            },
        },
        login: {
            textAlign: 'center',
            fontSize: '14px',
        }
    }),
);

const SignUp: React.FC = () => {
    const {t} = useTranslation()
    const classes = useStyles()

    return <Container title={t('auth.signup.title')}>
        <div className={classes.content}>
        <SignUpForm submit={signUp} submitButtonLabel={t('auth.signup.form.submitButton')}/>
        <Typography className={classes.login}>
            {<Trans id='privacy-notice'
                    i18nKey="auth.signup.logInLabel"
                    components={{a: <RouterLink to={ROUTE_SIGNIN}/>}}/>}
        </Typography>
        </div>
    </Container>
}

export default SignUp
