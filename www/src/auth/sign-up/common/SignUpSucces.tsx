import {Typography} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import React from "react";
import {useTranslation} from "react-i18next";
import signupSuccessImg from "../../../assets/signup_success.svg";
import Container from "../../../components/form/Container";

const useStyles = makeStyles((theme: Theme) =>
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

interface Props {
    subtitle: string
}

const SignUpSuccess: React.FC<Props> = ({subtitle}) => {
    const classes = useStyles()
    const {t} = useTranslation()

    return <Container title={t('auth.signUp.success.title')}>
        <div className={classes.root}>
            <Typography className={classes.subtitle}>{subtitle}</Typography>
            <img className={classes.image} src={signupSuccessImg} alt={t('auth.signUp.success.mailboxImage')}/>
        </div>
    </Container>
}

export default SignUpSuccess
