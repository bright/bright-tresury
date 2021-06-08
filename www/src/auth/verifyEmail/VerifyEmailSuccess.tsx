import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import successImg from '../../assets/email_verify_success.svg'
import Container from '../../components/form/Container'
import { RouterLink } from '../../components/link/RouterLink'
import { Header } from '../../components/text/Header'
import { ROUTE_SIGNIN } from '../../routes/routes'
import { breakpoints } from '../../theme/theme'
import { useAuth } from '../AuthContext'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        imageContainer: {
            textAlign: 'center',
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
            marginTop: '46px',
        },
        information: {
            textAlign: 'left',
        },
        image: {
            margin: '24px 0',
        },
    }),
)

const VerifyEmailSuccess = () => {
    const { t } = useTranslation()
    const classes = useStyles()
    const { isUserSignedIn } = useAuth()

    return (
        <Container title={t('auth.signIn.verifyEmail.success.title')}>
            <div className={classes.imageContainer}>
                <Header>{t('auth.signIn.verifyEmail.success.subtitle')}</Header>
                <img className={classes.image} src={successImg} alt={''} />
                {!isUserSignedIn && (
                    <p className={classes.information}>
                        <Trans
                            i18nKey="auth.signIn.verifyEmail.success.information"
                            components={{ a: <RouterLink to={ROUTE_SIGNIN} /> }}
                        />
                    </p>
                )}
            </div>
        </Container>
    )
}

export default VerifyEmailSuccess
