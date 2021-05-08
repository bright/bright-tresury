import {Formik} from "formik";
import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import * as Yup from "yup";
import {LoadingState, useLoading} from "../../../components/loading/LoadingWrapper";
import {fullValidatorForSchema} from "../../../util/form.util";
import {GetUserAgreementYupSchema, UserAgreementCheckbox} from "../common/UserAgreementCheckbox";
import {PrivacyNotice} from "../common/PrivacyNotice";
import {SignUpButton} from "../common/SignUpButton";
import {AlreadySignedUp} from "../common/AlreadySignedUp";
import {AccountSelect} from "../../../components/select/AccountSelect";
import {Account} from "../../../substrate-lib/hooks/useAccounts";
import {isWeb3Injected} from "@polkadot/extension-dapp";
import {ExtensionNotDetected} from "./ExtensionNotDetected";
import {ErrorBox} from "../../../components/form/ErrorBox";
import {useHistory} from 'react-router-dom';
import {ROUTE_SIGNUP_WEB3_SUCCESS} from "../../../routes/routes";
import {useAuth} from "../../AuthContext";
import {SignFormWrapper} from "../../sign-components/SignFormWrapper";
import {SignComponentWrapper} from "../../sign-components/SignComponentWrapper";

export interface Web3SignUpValues {
    account: Account,
    userAgreement: boolean
}

const Web3SignUp: React.FC = () => {
    const {t} = useTranslation()
    const history = useHistory()

    const {web3SignUp} = useAuth()

    const {call: signUpCall, loadingState, error} = useLoading(web3SignUp)

    const onSubmit = async (values: Web3SignUpValues) => {
        await signUpCall(values)
    }

    const validationSchema = Yup.object().shape({
        ...GetUserAgreementYupSchema(t)
    })

    useEffect(() => {
        if (loadingState === LoadingState.Resolved) {
            history.push(ROUTE_SIGNUP_WEB3_SUCCESS)
        }
    }, [loadingState])

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
            userAgreement: false
        }}
        validate={fullValidatorForSchema(validationSchema)}
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
                <SignComponentWrapper>
                    <UserAgreementCheckbox/>
                </SignComponentWrapper>
                <SignComponentWrapper>
                    <PrivacyNotice/>
                </SignComponentWrapper>
                <SignUpButton disabled={loadingState === LoadingState.Loading}/>
                <AlreadySignedUp/>
            </SignFormWrapper>
        }
    </Formik>
}

export default Web3SignUp
