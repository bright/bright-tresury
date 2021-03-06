import { Trans } from 'react-i18next'
import { Typography } from '@material-ui/core'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import RouterLink from '../../../components/link/RouterLink'
import { ROUTE_SIGNIN_EMAIL, ROUTE_SIGNIN_WEB3 } from '../../../routes/routes'
import { SignOption } from '../../sign-components/SignOption'

const useStyles = makeStyles(() => {
    return {
        login: {
            textAlign: 'center',
            fontSize: '14px',
            marginTop: '3.5em',
        },
    }
})

export interface AlreadySignedUpProps {
    signOption: SignOption
}

const AlreadySignedUp = ({ signOption }: AlreadySignedUpProps) => {
    const classes = useStyles()

    const getRoute = () => {
        switch (signOption) {
            case SignOption.Email:
                return ROUTE_SIGNIN_EMAIL
            case SignOption.Web3:
                return ROUTE_SIGNIN_WEB3
        }
    }

    return (
        <Typography className={classes.login}>
            {
                <Trans
                    id="privacy-notice"
                    i18nKey="auth.signUp.logInLabel"
                    components={{ a: <RouterLink to={getRoute()} replace={true} /> }}
                />
            }
        </Typography>
    )
}

export default AlreadySignedUp
