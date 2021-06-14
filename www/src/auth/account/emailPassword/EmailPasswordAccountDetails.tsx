import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../../components/button/Button'
import { useAuth } from '../../AuthContext'
import DisabledFormField from './components/DisabledFormField'
import EmailNotVerifiedError from './components/EmailNotVerifiedError'

const useStyles = makeStyles(() =>
    createStyles({
        spacing: {
            marginTop: '32px',
        },
    }),
)

const EmailPasswordAccountDetails = () => {
    const { t } = useTranslation()
    const classes = useStyles()
    const { user } = useAuth()

    return (
        <div>
            <DisabledFormField
                className={classes.spacing}
                title={t('account.emailPassword.username')}
                value={user?.username ?? ''}
            />
            <DisabledFormField
                className={classes.spacing}
                title={t('account.emailPassword.login')}
                value={user?.email ?? ''}
            />
            {!user?.isEmailVerified ? <EmailNotVerifiedError /> : null}
            {/*Feature is not implemented yet*/}
            {/*<Button className={classes.spacing} variant="text" color="primary">*/}
            {/*    {t('account.emailPassword.resetPassword')}*/}
            {/*</Button>*/}
        </div>
    )
}

export default EmailPasswordAccountDetails
