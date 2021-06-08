import { Trans } from 'react-i18next'
import { RouterLink } from '../../../components/link/RouterLink'
import { ROUTE_SIGNUP_EMAIL, ROUTE_SIGNUP_WEB3 } from '../../../routes/routes'
import { Typography } from '@material-ui/core'
import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { SignOption } from '../../sign-components/SignOption'

const useStyles = makeStyles(() =>
    createStyles({
        signUpLabel: {
            textAlign: 'center',
            fontSize: '14px',
            marginTop: '3em',
        },
    }),
)

interface OwnProps {
    signOption: SignOption
}

export const NotSignedUpYet: React.FC<OwnProps> = ({ signOption }) => {
    const classes = useStyles()

    const getRoute = () => {
        switch (signOption) {
            case SignOption.Email:
                return ROUTE_SIGNUP_EMAIL
            case SignOption.Web3:
                return ROUTE_SIGNUP_WEB3
        }
    }

    return (
        <Typography className={classes.signUpLabel}>
            {
                <Trans
                    id="privacy-notice"
                    i18nKey="auth.signIn.signUpLabel"
                    components={{ a: <RouterLink to={getRoute()} /> }}
                />
            }
        </Typography>
    )
}
