import { Trans } from 'react-i18next'
import { RouterLink } from '../../../components/link/RouterLink'
import { Typography } from '@material-ui/core'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { ROUTE_SIGNIN } from '../../../routes/routes'

const useStyles = makeStyles(() => {
    return {
        login: {
            textAlign: 'center',
            fontSize: '14px',
        },
    }
})

export const AlreadyLoggedIn: React.FC = () => {
    const classes = useStyles()

    return (
        <Typography className={classes.login}>
            {
                <Trans
                    id="privacy-notice"
                    i18nKey="auth.signUp.logInLabel"
                    components={{ a: <RouterLink to={ROUTE_SIGNIN} /> }}
                />
            }
        </Typography>
    )
}
