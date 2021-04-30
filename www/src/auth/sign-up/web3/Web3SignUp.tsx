import {Formik} from "formik";
import React from "react";
import {useTranslation} from "react-i18next";
import * as Yup from "yup";
import {LoadingState} from "../../../components/loading/LoadingWrapper";
import {fullValidatorForSchema} from "../../../util/form.util";
import {GetUserAgreementYupSchema, TermsAgreementCheckbox} from "../common/TermsAgreementCheckbox";
import {PrivacyNotice} from "../common/PrivacyNotice";
import {SignUpButton} from "../common/SignUpButton";
import {AlreadyLoggedIn} from "../common/AlreadyLoggedIn";
import {SignUpComponentWrapper} from "../common/SignUpComponentWrapper";
import {SignUpFormWrapper} from "../common/SignUpFormWrapper";
import {AccountSelect} from "../../../components/select/AccountSelect";
import {Account} from "../../../substrate-lib/hooks/useAccounts";
import SignUpSuccess from "../common/SignUpSucces";
import {isWeb3Injected} from "@polkadot/extension-dapp";
import {ExtensionNotDetected} from "./ExtensionNotDetected";
import {useWeb3SignUp} from "./handleWeb3Signup";
import {ErrorBox} from "../../../components/form/ErrorBox";

export interface Web3SignUpValues {
    account: Account,
    userAgreement: boolean
}

const Web3SignUp: React.FC = () => {
    const {t} = useTranslation()

    const {call: signUpCall, loadingState, error} = useWeb3SignUp()

    const onSubmit = async (values: Web3SignUpValues) => {
        await signUpCall(values)
    }

    const validationSchema = Yup.object().shape({
        ...GetUserAgreementYupSchema(t)
    })

    if (!isWeb3Injected) {
        return <ExtensionNotDetected/>
    }

    if (loadingState === LoadingState.Resolved) {
        return <SignUpSuccess subtitle={t('auth.signUp.web3SignUp.successSubtitle')}/>
    }

    return <Formik
        enableReinitialize={true}
        initialValues={{
            account: {
                name: t('substrate.form.selectAccount'),
                address: ''
            } as Account,
            userAgreement: false
        }}
        validate={fullValidatorForSchema(validationSchema)}
        onSubmit={onSubmit}>
        {({
              values,
              handleSubmit,
          }) =>
            <SignUpFormWrapper handleSubmit={handleSubmit}>
                {error && <SignUpComponentWrapper>
                    <ErrorBox error={error}/>
                </SignUpComponentWrapper>}
                <SignUpComponentWrapper>
                    <AccountSelect account={values.account}/>
                </SignUpComponentWrapper>
                <SignUpComponentWrapper>
                    <TermsAgreementCheckbox/>
                </SignUpComponentWrapper>
                <SignUpComponentWrapper>
                    <PrivacyNotice/>
                </SignUpComponentWrapper>
                <SignUpButton disabled={loadingState === LoadingState.Loading}/>
                <AlreadyLoggedIn/>
            </SignUpFormWrapper>
        }
    </Formik>
}

export default Web3SignUp
