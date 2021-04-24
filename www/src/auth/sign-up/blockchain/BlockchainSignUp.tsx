import {Formik} from "formik";
import {FormikHelpers} from "formik/dist/types";
import React from "react";
import {useTranslation} from "react-i18next";
import * as Yup from "yup";
import Container from "../../../components/form/Container";
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
import {useBlockchainSignUp} from "./handleBlockchainSignup";

interface BlockchainSignUpValues {
    account: Account,
    userAgreement: boolean
}

const BlockchainSignUp: React.FC = () => {
    const {t} = useTranslation()

    const {call: signUpCall, loadingState} = useBlockchainSignUp()

    const onSubmit = async (values: BlockchainSignUpValues, {setErrors}: FormikHelpers<BlockchainSignUpValues>) => {
        signUpCall(values.account)
    }

    const validationSchema = Yup.object().shape({
        ...GetUserAgreementYupSchema(t)
    })

    if (!isWeb3Injected) {
        return <ExtensionNotDetected/>
    }

    if (loadingState === LoadingState.Resolved) {
        return <Container title={t('auth.signup.title')}>
            <SignUpSuccess subtitle={t('auth.signup.blockchainSignUp.successSubtitle')}/>
        </Container>
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

export default BlockchainSignUp
