import { isWeb3Injected } from '@polkadot/extension-dapp'
import { Formik } from 'formik'
import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'
import * as Yup from 'yup'
import InfoBox from '../../../components/form/InfoBox'
import AccountSelect, { EMPTY_ACCOUNT } from '../../../components/select/AccountSelect'
import { ROUTE_SIGNUP_WEB3_SUCCESS } from '../../../routes/routes'
import { Account } from '../../../substrate-lib/accounts/AccountsContext'
import { useAccounts } from '../../../substrate-lib/accounts/useAccounts'
import { fullValidatorForSchema } from '../../../util/form.util'
import { useAuth } from '../../AuthContext'
import { SignComponentWrapper } from '../../sign-components/SignComponentWrapper'
import { SignFormWrapper } from '../../sign-components/SignFormWrapper'
import { SignOption } from '../../sign-components/SignOption'
import AlreadySignedUp from '../common/AlreadySignedUp'
import { PrivacyNotice } from '../common/PrivacyNotice'
import { SignUpButton } from '../common/SignUpButton'
import { GetUserAgreementYupSchema, UserAgreementCheckbox } from '../common/UserAgreementCheckbox'
import { ExtensionNotDetected } from './ExtensionNotDetected'
import { useWeb3SignUp } from './web3SignUp.api'

export interface Web3SignUpValues {
    account: Account
    userAgreement: boolean
}

export interface Web3SignUpLocationState {
    accountSelection: any
    infoMessage: string
}

const Web3SignUp = () => {
    const location = useLocation()
    const locationState = useMemo(() => location.state as Web3SignUpLocationState, [location])

    useEffect(() => {
        return () => {
            location.state = null
        }
    }, [])

    const accountSelectionAddress = locationState?.accountSelection?.address

    const { accounts } = useAccounts()
    let accountSelection = accountSelectionAddress && accounts.find((acc) => acc.address == accountSelectionAddress)
    const { t } = useTranslation()

    const history = useHistory()

    const { setIsUserSignedIn } = useAuth()
    const { mutateAsync, isLoading, isError, error } = useWeb3SignUp()

    const onSubmit = async (values: Web3SignUpValues) => {
        await mutateAsync(values, {
            onSuccess: () => {
                setIsUserSignedIn(true)
                history.replace(ROUTE_SIGNUP_WEB3_SUCCESS)
            },
        })
    }

    const validationSchema = Yup.object().shape({
        ...GetUserAgreementYupSchema(t),
    })

    if (!isWeb3Injected) {
        return <ExtensionNotDetected />
    }

    return (
        <Formik
            enableReinitialize={true}
            initialValues={{
                account: accountSelection ?? EMPTY_ACCOUNT,
                userAgreement: false,
            }}
            validate={fullValidatorForSchema(validationSchema)}
            onSubmit={onSubmit}
        >
            {({ values, handleSubmit }) => (
                <SignFormWrapper handleSubmit={handleSubmit}>
                    {locationState?.infoMessage && (
                        <SignComponentWrapper>
                            <InfoBox message={locationState.infoMessage} level={'info'} />
                        </SignComponentWrapper>
                    )}
                    {isError && error ? (
                        <SignComponentWrapper>
                            <InfoBox message={t('auth.signUp.web3SignUp.failureMessage')} level={'error'} />
                        </SignComponentWrapper>
                    ) : null}
                    <SignComponentWrapper>
                        <AccountSelect />
                    </SignComponentWrapper>
                    <SignComponentWrapper>
                        <UserAgreementCheckbox />
                    </SignComponentWrapper>
                    <SignComponentWrapper>
                        <PrivacyNotice />
                    </SignComponentWrapper>
                    <SignUpButton disabled={isLoading} />
                    <AlreadySignedUp signOption={SignOption.Web3} />
                </SignFormWrapper>
            )}
        </Formik>
    )
}

export default Web3SignUp
