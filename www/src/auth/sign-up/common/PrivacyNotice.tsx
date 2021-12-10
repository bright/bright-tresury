import { Trans } from 'react-i18next'
import { Label } from '../../../components/text/Label'
import React from 'react'
import { ROUTE_PRIVACY } from '../../../routes/routes'
import NormalRouterLink from '../../../components/link/NormalRouterLink'

export const PrivacyNotice: React.FC = () => {
    return (
        <Label
            label={
                <Trans
                    id="privacy-notice"
                    i18nKey="auth.signUp.privacyNotice"
                    components={{ a: <NormalRouterLink to={ROUTE_PRIVACY} /> }}
                />
            }
        />
    )
}
