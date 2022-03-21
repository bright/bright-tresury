import { AxiosError } from 'axios'
import { Formik } from 'formik'
import React, { useEffect, useMemo } from 'react'
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
import useIdentity from '../../../util/useIdentity'

const EmailPasswordAccountForm = () => {
    const { t } = useTranslation()
    const { user, refreshSession } = useAuth()
    const { accounts } = useAccounts()
    const { initialValues, validationSchema } = useSignUpForm()

    const primaryAccount = useMemo(() => {
        const address = user?.web3Addresses.find((address) => address.isPrimary)
        if (!address) return
        const account = accounts.find((account) => account.address === address.encodedAddress)
        return account
    }, [user, accounts])

    const { identity } = useIdentity({ address: primaryAccount?.address })

    const { mutateAsync, error, isLoading } = useAssociateEmailPassword()

    const onSubmit = (data: SignUpValues) => {
        if (!primaryAccount) return Promise.reject(Error(t('account.emailPassword.accountNotFound')))

        return mutateAsync(
            {
                account: primaryAccount,
                details: data,
            },
            {
                onSuccess: () => {
                    refreshSession()
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
            initialValues={{ ...initialValues, username: identity?.display ?? initialValues.username }}
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
