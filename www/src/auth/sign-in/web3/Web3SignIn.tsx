import {Formik} from "formik";
import React, {useMemo, useRef} from "react";
import {useTranslation} from "react-i18next";
import {InfoBox} from "../../../components/form/InfoBox";
import {LoadingState, useLoading} from "../../../components/loading/LoadingWrapper";
import {useAuth} from "../../AuthContext";
import {NotSignedUpYet} from "../common/NotSignedUpYet";
import {SignInButton} from "../common/SignInButton";
import {SignFormWrapper} from "../../sign-components/SignFormWrapper";
import {SignComponentWrapper} from "../../sign-components/SignComponentWrapper";
import {AccountSelect} from "../../../components/select/AccountSelect";
import {Account, useAccounts} from "../../../substrate-lib/hooks/useAccounts";
import {isWeb3Injected} from "@polkadot/extension-dapp";
import {ExtensionNotDetected} from "../../sign-up/web3/ExtensionNotDetected";
import {useHistory} from "react-router";
import {ROUTE_SIGNUP_WEB3} from "../../../routes/routes";
import {Web3SignUpLocationState} from "../../sign-up/web3/Web3SignUp";
import {SignOption} from "../../sign-components/SignOption";

export interface Web3SignInValues {
    account: Account,
}

const Web3SignIn = () => {
    const {t} = useTranslation()
    const accounts = useAccounts()

    const {web3SignIn} = useAuth()
    const {call: signInCall, loadingState, error} = useLoading(web3SignIn)

    const onSubmit = async (values: Web3SignInValues) => {
        await signInCall(values)
    }

    const isNotFoundError = useMemo(() => {
            return loadingState === LoadingState.Error && error && (error as any).response?.status === 404
        }, [loadingState, error]
    )

    const formikRef = useRef<any>()
    const history = useHistory()
    if (isNotFoundError) {
        const selectedAccount = formikRef?.current?.values?.account
        history.push(ROUTE_SIGNUP_WEB3, {
            accountSelection: selectedAccount,
            infoMessage: t('auth.signIn.web3SignIn.userDoesNotExist')
        } as Web3SignUpLocationState)
    }

    if (!isWeb3Injected) {
        return <ExtensionNotDetected/>
    }

    return <Formik
        enableReinitialize={true}
        initialValues={{
            account: {
                name: t('substrate.form.selectAccount'),
                address: ''
            } as Account,
        } as Web3SignInValues}
        innerRef={formikRef}
        onSubmit={onSubmit}>
        {({
              values,
              handleSubmit,
          }) =>
            <SignFormWrapper handleSubmit={handleSubmit}>
                {(loadingState === LoadingState.Error && error) ? <SignComponentWrapper>
                    <InfoBox message={t('auth.signIn.web3SignIn.failureMessage')} level={"error"}/>
                </SignComponentWrapper> : null}
                <SignComponentWrapper>
                    <AccountSelect accounts={accounts}/>
                </SignComponentWrapper>
                <SignInButton disabled={loadingState === LoadingState.Loading}/>
                <NotSignedUpYet signOption={SignOption.Web3}/>
            </SignFormWrapper>
        }
    </Formik>
}

export default Web3SignIn
