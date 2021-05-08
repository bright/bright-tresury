import {Formik} from "formik";
import React from "react";
import {useTranslation} from "react-i18next";
import {ErrorBox} from "../../../components/form/ErrorBox";
import {LoadingState, useLoading} from "../../../components/loading/LoadingWrapper";
import {useAuth} from "../../AuthContext";
import {SignUpLabel} from "../common/SignUpLabel";
import {SignInButton} from "../common/SignInButton";
import {SignFormWrapper} from "../../sign-components/SignFormWrapper";
import {SignComponentWrapper} from "../../sign-components/SignComponentWrapper";
import {AccountSelect} from "../../../components/select/AccountSelect";
import {Account} from "../../../substrate-lib/hooks/useAccounts";
import {isWeb3Injected} from "@polkadot/extension-dapp";
import {ExtensionNotDetected} from "../../sign-up/web3/ExtensionNotDetected";

export interface Web3SignInValues {
    account: Account,
}

const Web3SignIn = () => {
    const {t} = useTranslation()

    const {web3SignIn} = useAuth()

    const {call: signInCall, loadingState, error} = useLoading(web3SignIn)

    const onSubmit = async (values: Web3SignInValues) => {
        await signInCall(values)
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
        onSubmit={onSubmit}>
        {({
              values,
              handleSubmit,
          }) =>
            <SignFormWrapper handleSubmit={handleSubmit}>
                {(loadingState === LoadingState.Error && error) ? <SignComponentWrapper>
                    <ErrorBox error={t('auth.signUp.web3SignUp.failureMessage')}/>
                </SignComponentWrapper> : null}
                <SignComponentWrapper>
                    <AccountSelect account={values.account}/>
                </SignComponentWrapper>
                <SignInButton disabled={loadingState === LoadingState.Loading}/>
                <SignUpLabel/>
            </SignFormWrapper>
        }
    </Formik>
}

export default Web3SignIn
