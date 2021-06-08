import { Typography } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import emailSignUpSuccess from '../../../assets/email_signup_success.svg'
import Container from '../../../components/form/Container'
import { SignUpSuccessContent } from '../common/SignUpSuccessContent'

const useStyles = makeStyles(() =>
    createStyles({
        subtitle: {
            marginTop: '36px',
            fontSize: '14px',
        },
    }),
)

const EmailSignUpSuccess = () => {
    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <Container title={t('auth.signUp.title')}>
            <SignUpSuccessContent successImg={emailSignUpSuccess}>
                <Typography className={classes.subtitle}>
                    {t('auth.signUp.emailSignUp.form.successSubtitle')}
                </Typography>
            </SignUpSuccessContent>
        </Container>
    )
}

export default EmailSignUpSuccess
