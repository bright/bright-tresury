import {Formik} from "formik";
import {FormikHelpers} from "formik/dist/types";
import React from "react";
import {useTranslation} from "react-i18next";
import * as Yup from "yup";
import {Input} from "../../../components/form/input/Input";
import {PasswordInput} from "../../../components/form/input/password/PasswordInput";
import {LoadingState} from "../../../components/loading/LoadingWrapper";
import {fullValidatorForSchema} from "../../../util/form.util";
import {signUp} from "../../auth.api";
import {useSuperTokensRequest} from "../../supertokens.utils/useSuperTokensRequest";
import {GetUserAgreementYupSchema, TermsAgreementCheckbox} from "../common/TermsAgreementCheckbox";
import {PrivacyNotice} from "../common/PrivacyNotice";
import {SignUpButton} from "../common/SignUpButton";
import {AlreadyLoggedIn} from "../common/AlreadyLoggedIn";
import {SignUpInputWrapper} from "../common/SignUpInputWrapper";
import {SignUpFormWrapper} from "../common/SignUpFormWrapper";

interface EmailSignUpValues {
    username: string,
    email: string,
    password: string,
    userAgreement: boolean
}

const EmailSignUp: React.FC = () => {
    const {t} = useTranslation()

    const {call, loadingState} = useSuperTokensRequest(signUp)

    const onSubmit = async (values: EmailSignUpValues, {setErrors}: FormikHelpers<EmailSignUpValues>) => {
        await call(values, setErrors)
    }

    const validationSchema = Yup.object().shape({
        username: Yup.string().required(t('auth.signUp.emptyFieldError')),
        email: Yup.string().email(t('auth.signUp.emailSignUp.form.login.emailError')).required(t('auth.signUp.emptyFieldError')),
        password: Yup.string()
            .min(8, t('auth.signUp.emailSignUp.form.password.tooShort'))
            .matches(/[a-z]+/, t('auth.signUp.emailSignUp.form.password.useLowerCaseLetter'))
            .matches(/[0-9]+/, t('auth.signUp.emailSignUp.form.password.useNumber')),
        ...GetUserAgreementYupSchema(t)
    })
    const passwordValidationRules = validationSchema.fields.password.tests.map(({OPTIONS}) => OPTIONS.message?.toString() || '')

    if (loadingState === LoadingState.Resolved) {
        return <EmailSignUpSuccess/>
    }

    return <Formik
        enableReinitialize={true}
        initialValues={{
            username: '',
            email: '',
            password: '',
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
                    <Input
                        name="username"
                        placeholder={t('auth.signUp.emailSignUp.form.username.placeholder')}
                        label={t('auth.signUp.emailSignUp.form.username.label')}/>
                </SignUpInputWrapper>
                <SignUpInputWrapper>
                    <Input
                        name="email"
                        placeholder={t('auth.signUp.emailSignUp.form.login.placeholder')}
                        label={t('auth.signUp.emailSignUp.form.login.label')}/>
                </SignUpInputWrapper>
                <SignUpInputWrapper>
                    <PasswordInput
                        name="password"
                        placeholder={t('auth.signUp.emailSignUp.form.password.placeholder')}
                        label={t('auth.signUp.emailSignUp.form.password.label')}
                        validationRules={passwordValidationRules}
                    />
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

export default EmailSignUp