import { Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Header } from '../../../components/text/Header'
import signupSuccessImg from '../../../assets/signup_success.svg'

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
)

const Web3SignUpSuccess: React.FC = () => {
    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <div className={classes.root}>
            <Header>{t('auth.signup.success.title')}</Header>
            <Typography className={classes.subtitle}>{t('auth.signup.success.subtitle')}</Typography>
            <img className={classes.image} src={signupSuccessImg} alt={t('auth.signup.success.mailboxImage')} />
        </div>
    )
}

export default Web3SignUpSuccess
