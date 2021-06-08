import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import errorImg from '../../assets/email_verify_error.svg'
import Container from '../../components/form/Container'
import { Header } from '../../components/text/Header'
import { breakpoints } from '../../theme/theme'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        imageContainer: {
            textAlign: 'center',
            alignSelf: 'center',
            marginTop: '46px',
        },
        information: {
            textAlign: 'left',
            marginTop: '36px',
            marginBottom: '64px',
        },
        image: {
            margin: '24px 0',
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
        button: {
            marginTop: '36px',
        },
    }),
)

const VerifyEmailError = () => {
    const { t } = useTranslation()
    const classes = useStyles()

    return (
        <Container title={t('auth.signIn.verifyEmail.error.title')}>
            <div className={classes.imageContainer}>
                <Header>{t('auth.signIn.verifyEmail.error.subtitle')}</Header>
                <p className={classes.information}>{t('auth.signIn.verifyEmail.error.information')}</p>
                <img className={classes.image} src={errorImg} alt={''} />
            </div>
        </Container>
    )
}

export default VerifyEmailError
