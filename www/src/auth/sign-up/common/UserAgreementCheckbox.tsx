import { Trans } from 'react-i18next'
import CheckboxInput from '../../../components/form/input/CheckboxInput'
import React from 'react'
import * as Yup from 'yup'
import { TFunction } from 'i18next'
import UnderlinedLink from '../../../components/link/UnderlinedLink'

export const GetUserAgreementYupSchema = (t: TFunction) => {
    return { userAgreement: Yup.boolean().isTrue(t('auth.signUp.userAgreement.emptyFieldError')) }
}

export const UserAgreementCheckbox: React.FC = () => {
    return (
        <CheckboxInput
            name="userAgreement"
            label={
                <Trans
                    id="privacy-notice"
                    i18nKey="auth.signUp.userAgreement.label"
                    components={{ a: <UnderlinedLink href="" /> }}
                />
            }
        />
    )
}
