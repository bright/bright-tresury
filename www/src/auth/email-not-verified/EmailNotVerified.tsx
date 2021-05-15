import React from 'react'
import emailNotVerifiedImage from '../../assets/email_not_verified.svg'
import Container from '../../components/form/Container'
import { useTranslation } from 'react-i18next'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { breakpoints } from '../../theme/theme'
import { Button } from '../../components/button/Button'
import { sendVerifyEmail } from '../auth.api'
import { useAuth } from '../AuthContext'
import { ROUTE_SIGNIN, ROUTE_STATS } from '../../routes/routes'
import { useHistory } from 'react-router'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        title: {
            marginTop: '3em',
            alignSelf: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
        },
        subTitle: {
            alignSelf: 'center',
            fontSize: '16px',
        },
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
        buttonWrapper: {
            alignSelf: 'center',
        },
    }),
)

export const EmailNotVerified = () => {
    const classes = useStyles()

    const { t } = useTranslation()

    const history = useHistory()

    const { isUserSignedIn, isUserVerified } = useAuth()

    if (!isUserSignedIn) {
        history.push(ROUTE_SIGNIN)
    }

    if (isUserVerified) {
        history.push(ROUTE_STATS)
    }

    return (
        <Container title={t('auth.emailNotVerified.title')}>
            <p className={classes.title}>{t('auth.emailNotVerified.seemsLikeYourEmailIsNotVerified')}</p>
            <p className={classes.subTitle}>{t('auth.emailNotVerified.pleaseVerifyYourEmail')}</p>
            <img className={classes.image} src={emailNotVerifiedImage} alt={''} />
            <div className={classes.buttonWrapper}>
                <Button type={'button'} color={'primary'} onClick={sendVerifyEmail}>
                    {t('auth.emailNotVerified.resendVerificationEmail')}
                </Button>
            </div>
        </Container>
    )
}