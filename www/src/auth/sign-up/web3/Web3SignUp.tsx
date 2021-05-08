import {Formik} from "formik";
import React, {useEffect, useMemo} from "react";
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
import {InfoBox} from "../../../components/form/InfoBox";
import {useHistory, useLocation} from 'react-router-dom';
import {ROUTE_SIGNUP_WEB3_SUCCESS} from "../../../routes/routes";
import {useAuth} from "../../AuthContext";
import {SignFormWrapper} from "../../sign-components/SignFormWrapper";
import {SignComponentWrapper} from "../../sign-components/SignComponentWrapper";

export interface Web3SignUpValues {
    account: Account,
    userAgreement: boolean
}

export interface Web3SignUpLocationState {
    accountSelection: any
    infoMessage: string
}

const Web3SignUp: React.FC = () => {
    const location = useLocation()
    const locationState = useMemo(() => location.state as Web3SignUpLocationState, [location])
    useEffect(() => {
        return () => {
            location.state = null
        }
    }, [])
    const accountSelection = locationState?.accountSelection

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
            account: accountSelection ?? {
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
                {locationState?.infoMessage && <SignComponentWrapper>
                    <InfoBox message={locationState.infoMessage} level={"info"}/>
                </SignComponentWrapper>}
                {(loadingState === LoadingState.Error && error) ? <SignComponentWrapper>
                    <InfoBox message={t('auth.signUp.web3SignUp.failureMessage')} level={"error"}/>
                </SignComponentWrapper> : null}
                <SignComponentWrapper>
                    <AccountSelect account={{} as Account}/>
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
