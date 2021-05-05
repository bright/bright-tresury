import React from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {Header} from "../../../components/text/Header";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            marginTop: '4em',
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
    successImg: string
}

export const SignUpSuccessContent: React.FC<Props> = ({successImg, children}) => {
    const classes = useStyles()
    const {t} = useTranslation()
    return <div className={classes.root}>
        <Header>{t('auth.signUp.success.title')}</Header>
        {children}
        <img className={classes.image} src={successImg} alt={t('auth.signUp.success.mailboxImage')}/>
    </div>
}
