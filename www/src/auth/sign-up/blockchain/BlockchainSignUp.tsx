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
import {useBlockchainSignUp} from "./handleBlockchainSignup";
import {ErrorBox} from "../../../components/form/ErrorBox";
import {makeStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => {
    return {
        errorBox: {
            marginTop: '1em'
        }
    }
})

export interface BlockchainSignUpValues {
    account: Account,
    userAgreement: boolean
}

const BlockchainSignUp: React.FC = () => {
    const classes = useStyles()
    const {t} = useTranslation()

    const {call: signUpCall, loadingState, error} = useBlockchainSignUp()

    const onSubmit = async (values: BlockchainSignUpValues) => {
        await signUpCall(values)
    }

    const validationSchema = Yup.object().shape({
        ...GetUserAgreementYupSchema(t)
    })

    if (!isWeb3Injected) {
        return <ExtensionNotDetected/>
    }

    if (loadingState === LoadingState.Resolved) {
        return <SignUpSuccess subtitle={t('auth.signUp.blockchainSignUp.successSubtitle')}/>
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
                {error && <div className={classes.errorBox}>
                    <ErrorBox error={error}/>
                </div>}
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
