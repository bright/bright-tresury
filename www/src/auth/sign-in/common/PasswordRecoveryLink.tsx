import React from 'react'
import { ROUTE_PASSWORD_RECOVERY } from '../../../routes/routes'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import NormalRouterLink from '../../../components/link/NormalRouterLink'

const useStyles = makeStyles(() =>
    createStyles({
        forgotPassword: {
            marginTop: '3em',
            cursor: 'pointer',
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'underline',
            },
        },
    }),
)

interface OwnProps {}

export type PasswordRecoveryProps = OwnProps

const PasswordRecoveryLink = () => {
    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <NormalRouterLink className={classes.forgotPassword} to={ROUTE_PASSWORD_RECOVERY}>
            {t('auth.signIn.emailSignIn.forgotPassword')}
        </NormalRouterLink>
    )
}

export default PasswordRecoveryLink
