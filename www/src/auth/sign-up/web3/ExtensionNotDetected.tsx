import { useTranslation } from 'react-i18next'
import Button from '../../../components/button/Button'
import React from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { useHistory } from 'react-router'
import { ROUTE_SIGNUP_EMAIL } from '../../../routes/routes'
import { SignComponentWrapper } from '../../sign-components/SignComponentWrapper'

const useStyles = makeStyles((theme: Theme) => {
    return {
        root: {
            display: 'flex',
            justifyContent: 'center',
        },
        info: {
            whiteSpace: 'pre-line',
        },
        button: {
            color: theme.palette.primary.main,
            fontWeight: 'bold',
            fontSize: 14,
        },
    }
})

export const ExtensionNotDetected: React.FC = () => {
    const { t } = useTranslation()
    const history = useHistory()
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <SignComponentWrapper>
                <p className={classes.info}>{t('auth.signUp.web3SignUp.extensionNotDetected')}</p>
                <Button variant={'text'} className={classes.button} onClick={() => history.push(ROUTE_SIGNUP_EMAIL)}>
                    {t('auth.signUp.web3SignUp.signUpWithEmail')}
                </Button>
            </SignComponentWrapper>
        </div>
    )
}
