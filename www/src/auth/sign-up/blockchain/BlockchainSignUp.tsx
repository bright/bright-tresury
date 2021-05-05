import {Formik} from "formik";
import {FormikHelpers} from "formik/dist/types";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import * as Yup from "yup";
import Container from "../../../components/form/Container";
import {LoadingState} from "../../../components/loading/LoadingWrapper";
import {fullValidatorForSchema} from "../../../util/form.util";
import {signUp} from "../../auth.api";
import {useSuperTokensRequest} from "../../supertokens.utils/useSuperTokensRequest";
import BlockchainSignUpSuccess from "./BlockchainSignUpSuccess";
import {GetUserAgreementYupSchema, TermsAgreementCheckbox} from "../common/TermsAgreementCheckbox";
import {PrivacyNotice} from "../common/PrivacyNotice";
import {SignUpButton} from "../common/SignUpButton";
import {AlreadyLoggedIn} from "../common/AlreadyLoggedIn";
import {SignUpInputWrapper} from "../common/SignUpInputWrapper";
import {SignUpFormWrapper} from "../common/SignUpFormWrapper";
import {AccountSelect} from "../../../components/select/AccountSelect";
import {Account} from "../../../substrate-lib/components/SubmittingTransaction";
import {KeyringState} from "../../../substrate-lib/SubstrateContext";
import {useSubstrate} from "../../../substrate-lib";

interface BlockchainSignUpValues {
    account: Account,
    userAgreement: boolean
}

const BlockchainSignUp: React.FC = () => {
    const {t} = useTranslation()

    const {keyringState, keyring} = useSubstrate();
    const [accounts, setAccounts] = useState<Account[]>([])
    useEffect(() => {
        if (keyringState === KeyringState.READY && keyring) {
            const keyringAccounts = keyring.getAccounts().map((account) => {
                return {name: account.meta?.name || '', address: account.address} as Account
            })
            setAccounts(keyringAccounts)
        }
    }, [keyring, keyringState])

    const {call, loadingState} = useSuperTokensRequest(signUp)

    const onSubmit = async (values: BlockchainSignUpValues, {setErrors}: FormikHelpers<BlockchainSignUpValues>) => {
        // TODO:// create blockchain sign up logic
    }

    const validationSchema = Yup.object().shape({
        ...GetUserAgreementYupSchema(t)
    })

    if (loadingState === LoadingState.Resolved) {
        return <Container title={t('auth.signup.title')}>
            <BlockchainSignUpSuccess/>
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
                <SignUpInputWrapper>
                    <AccountSelect account={values.account} accounts={accounts}/>
                </SignUpInputWrapper>
                <SignUpInputWrapper>
                    <TermsAgreementCheckbox/>
                </SignUpInputWrapper>
                <SignUpInputWrapper>
                    <PrivacyNotice/>
                </SignUpInputWrapper>
                <SignUpButton disabled={loadingState === LoadingState.Loading}/>
                <AlreadyLoggedIn/>
            </SignUpFormWrapper>
        }
    </Formik>
}

export default BlockchainSignUp
