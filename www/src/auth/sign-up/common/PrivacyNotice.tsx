import { Trans } from 'react-i18next'
import { Label } from '../../../components/text/Label'
import React from 'react'
import UnderlinedLink from '../../../components/link/UnderlinedLink'

export const PrivacyNotice: React.FC = () => {
    return (
        <Label
            label={
                <Trans
                    id="privacy-notice"
                    i18nKey="auth.signUp.privacyNotice"
                    components={{ a: <UnderlinedLink href="/" /> }}
                />
            }
        />
    )
}
