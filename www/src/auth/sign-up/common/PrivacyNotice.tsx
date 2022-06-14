import { Trans } from 'react-i18next'
import React from 'react'
import { ROUTE_PRIVACY } from '../../../routes/routes'
import NormalRouterLink from '../../../components/link/NormalRouterLink'
import { makeStyles } from '@material-ui/core/styles'
import { createStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginBottom: '8px',
            color: theme.palette.text.primary,
            fontSize: '12px',
        },
    }),
)

export const PrivacyNotice: React.FC = () => {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <Trans
                id="privacy-notice"
                i18nKey="auth.signUp.privacyNotice"
                components={{ a: <NormalRouterLink to={ROUTE_PRIVACY} /> }}
            />
        </div>
    )
}
