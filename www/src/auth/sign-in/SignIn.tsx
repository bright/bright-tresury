import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import React from "react";
import {useTranslation} from "react-i18next";
import loginImg from "../../assets/login.svg";
import Container from "../../components/form/Container";
import {breakpoints} from "../../theme/theme";
import SignInForm from "./SignInForm";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        image: {
            alignSelf: 'center',
            margin: '3em 0',
            flexGrow: 1,
            maxWidth: '320px',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                maxWidth: '75%',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                paddingLeft: '1em',
                paddingRight: '1em',
                maxWidth: '100%',
            },
        },
    }),
);

const SignIn = () => {
    const {t} = useTranslation()
    const classes = useStyles()

    return <Container title={t('auth.signIn.title')}>
        <img className={classes.image} src={loginImg} alt={''}/>
        <SignInForm/>
    </Container>
}

export default SignIn
