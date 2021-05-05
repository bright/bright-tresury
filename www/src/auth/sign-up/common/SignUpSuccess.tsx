import React from "react";
import {useTranslation} from "react-i18next";
import {SignUpSuccessContent} from "./SignUpSuccessContent";
import signUpSuccessImg from "../../../assets/successful_sign_up.svg";
import {Theme} from "@material-ui/core";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {Link} from "react-router-dom";
import {ROUTE_ROOT} from "../../../routes/routes";
import Container from "../../../components/form/Container";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        subtitle: {
            marginTop: '36px',
            fontSize: '18px',
            color: theme.palette.primary.main,
            textDecoration: 'none',
            fontWeight: 'bold'
        },
    })
)

export const SignUpSuccess: React.FC = () => {
    const classes = useStyles()
    const {t} = useTranslation()

    return <Container title={t('auth.signUp.title')}>
        <SignUpSuccessContent successImg={signUpSuccessImg}>
            <Link to={ROUTE_ROOT} className={classes.subtitle}>
                {t('auth.signUp.web3SignUp.successSubtitle')}
            </Link>
        </SignUpSuccessContent>
    </Container>
}
