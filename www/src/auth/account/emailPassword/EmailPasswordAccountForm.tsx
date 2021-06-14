import { AxiosError } from 'axios'
import { Formik } from 'formik'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import InfoBox from '../../../components/form/InfoBox'
import { useAccounts } from '../../../substrate-lib/accounts/useAccounts'
import { fullValidatorForSchema } from '../../../util/form.util'
import { useAuth } from '../../AuthContext'
import { SignComponentWrapper } from '../../sign-components/SignComponentWrapper'
import { SignFormWrapper } from '../../sign-components/SignFormWrapper'
import { SignUpButton } from '../../sign-up/common/SignUpButton'
import EmailSignUpFormFields from '../../sign-up/email/form/EmailSignUpFormFields'
import useSignUpForm, { SignUpValues } from '../../sign-up/email/form/useSignUpForm'
import { useAssociateEmailPassword } from './emailPassword.api'

const EmailPasswordAccountForm = () => {
    const { t } = useTranslation()
    const { user, refreshJwt } = useAuth()
    const { accounts } = useAccounts()
    const { initialValues, validationSchema } = useSignUpForm()

    const { mutateAsync, error, isLoading } = useAssociateEmailPassword()

    const onSubmit = (data: SignUpValues) => {
        const address = user?.web3Addresses.find((address) => address.isPrimary)
        if (!address) {
            return Promise.reject(Error(t('account.emailPassword.addressNotFound')))
        }
        const account = accounts.find((account) => account.address === address.address)
        if (!account) {
            return Promise.reject(Error(t('account.emailPassword.accountNotFound')))
        }
        return mutateAsync(
            {
                account,
                details: data,
            },
            {
                onSuccess: () => {
                    refreshJwt()
                },
            },
        )
    }

    const errorMessage = useMemo(() => {
        if (!error) {
            return undefined
        }

        const typedError = error as AxiosError
        const message = typedError.response?.data?.message || typedError?.message

        return message ?? t('account.emailPassword.addingFailed')
    }, [error, t])

    return (
        <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            validate={fullValidatorForSchema(validationSchema)}
            onSubmit={onSubmit}
        >
            {({ handleSubmit }) => (
                <SignFormWrapper handleSubmit={handleSubmit} variant={'left'}>
                    <EmailSignUpFormFields />
                    {errorMessage ? (
                        <SignComponentWrapper>
                            <InfoBox message={errorMessage} level={'error'} />
                        </SignComponentWrapper>
                    ) : null}
                    <SignUpButton disabled={isLoading} label={t('account.emailPassword.addEmailCredentials')} />
                </SignFormWrapper>
            )}
        </Formik>
    )
}

export default EmailPasswordAccountForm
