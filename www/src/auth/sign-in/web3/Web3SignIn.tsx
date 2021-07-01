import { AxiosError } from 'axios'
import { Formik } from 'formik'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import InfoBox from '../../../components/form/InfoBox'
import AccountSelect from '../../../components/select/AccountSelect'
import { ROUTE_SIGNUP_WEB3 } from '../../../routes/routes'
import { Account } from '../../../substrate-lib/accounts/AccountsContext'
import { useAccounts } from '../../../substrate-lib/accounts/useAccounts'
import { useAuth } from '../../AuthContext'
import { SignComponentWrapper } from '../../sign-components/SignComponentWrapper'
import { SignFormWrapper } from '../../sign-components/SignFormWrapper'
import { SignOption } from '../../sign-components/SignOption'
import { ExtensionNotDetected } from '../../sign-up/web3/ExtensionNotDetected'
import { Web3SignUpLocationState } from '../../sign-up/web3/Web3SignUp'
import NotSignedUpYet from '../common/NotSignedUpYet'
import { SignInButton } from '../common/SignInButton'
import { useWeb3SignIn } from './web3SignIn.api'

export interface Web3SignInValues {
    account: Account
}

const Web3SignIn = () => {
    const { t } = useTranslation()

    const formikRef = useRef<any>()
    const history = useHistory()

    const { setIsUserSignedIn } = useAuth()
    const { mutateAsync, isLoading, isError, error } = useWeb3SignIn()
    const { isWeb3Injected } = useAccounts()

    const onSubmit = async (values: Web3SignInValues) => {
        await mutateAsync(values, {
            onSuccess: () => {
                setIsUserSignedIn(true)
            },
            onError: (err) => {
                if ((err as AxiosError).response?.status === 404) {
                    const selectedAccount = formikRef?.current?.values?.account
                    history.push(ROUTE_SIGNUP_WEB3, {
                        accountSelection: selectedAccount,
                        infoMessage: t('auth.signIn.web3SignIn.userDoesNotExist'),
                    } as Web3SignUpLocationState)
                }
            },
        })
    }

    if (!isWeb3Injected) {
        return <ExtensionNotDetected />
    }

    return (
        <Formik
            enableReinitialize={true}
            initialValues={
                {
                    account: {
                        name: t('substrate.form.selectAccount'),
                        address: '',
                    } as Account,
                } as Web3SignInValues
            }
            innerRef={formikRef}
            onSubmit={onSubmit}
        >
            {({ handleSubmit }) => (
                <SignFormWrapper handleSubmit={handleSubmit}>
                    {isError && error ? (
                        <SignComponentWrapper>
                            <InfoBox message={t('auth.signIn.web3SignIn.failureMessage')} level={'error'} />
                        </SignComponentWrapper>
                    ) : null}
                    <SignComponentWrapper>
                        <AccountSelect />
                    </SignComponentWrapper>
                    <SignInButton disabled={isLoading} />
                    <NotSignedUpYet signOption={SignOption.Web3} />
                </SignFormWrapper>
            )}
        </Formik>
    )
}

export default Web3SignIn
