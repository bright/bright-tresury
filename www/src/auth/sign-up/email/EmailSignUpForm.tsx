import { Formik } from 'formik'
import { FormikHelpers } from 'formik/dist/types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { Input } from '../../../components/form/input/Input'
import { PasswordInput } from '../../../components/form/input/password/PasswordInput'
import { LoadingState } from '../../../components/loading/LoadingWrapper'
import { fullValidatorForSchema } from '../../../util/form.util'
import { SuperTokensAPIResponse, useSuperTokensRequest } from '../../supertokens.utils/useSuperTokensRequest'
import { SignUpComponentWrapper } from '../common/SignUpComponentWrapper'
import { SignUpFormWrapper } from '../common/SignUpFormWrapper'
import { UserAgreementCheckbox } from '../common/UserAgreementCheckbox'
import { PrivacyNotice } from '../common/PrivacyNotice'
import { SignUpButton } from '../common/SignUpButton'
import EmailSignUpSuccess from './EmailSignUpSucces'

interface SignUpValues {
    username: string
    email: string
    password: string
    userAgreement: boolean
}

interface OwnProps {
    submit: (values: SignUpValues) => Promise<SuperTokensAPIResponse>
    submitButtonLabel: string
}

export type SignupFormProps = OwnProps

const EmailSignUpForm = ({ submit, submitButtonLabel }: SignupFormProps) => {
    const { t } = useTranslation()

    const { call, loadingState } = useSuperTokensRequest(submit)

    const onSubmit = async (values: SignUpValues, { setErrors }: FormikHelpers<SignUpValues>) => {
        await call(values, setErrors)
    }

    const validationSchema = Yup.object().shape({
        username: Yup.string().required(t('auth.signup.form.emptyFieldError')),
        email: Yup.string()
            .email(t('auth.signup.form.login.emailError'))
            .required(t('auth.signup.form.emptyFieldError')),
        password: Yup.string()
            .min(8, t('auth.signup.form.password.tooShort'))
            .matches(/[a-z]+/, t('auth.signup.form.password.useLowerCaseLetter'))
            .matches(/[0-9]+/, t('auth.signup.form.password.useNumber')),
        userAgreement: Yup.boolean().isTrue(t('auth.signup.form.userAgreement.emptyFieldError')),
    })
    const passwordValidationRules = validationSchema.fields.password.tests.map(
        ({ OPTIONS }) => OPTIONS.message?.toString() || '',
    )

    if (loadingState === LoadingState.Resolved) {
        return <EmailSignUpSuccess />
    }

    return (
        <Formik
            enableReinitialize={true}
            initialValues={{
                username: '',
                email: '',
                password: '',
                userAgreement: false,
            }}
            validate={fullValidatorForSchema(validationSchema)}
            onSubmit={onSubmit}
        >
            {({ values, handleSubmit }) => (
                <SignUpFormWrapper handleSubmit={handleSubmit}>
                    <SignUpComponentWrapper>
                        <Input
                            name="username"
                            placeholder={t('auth.signup.form.username.placeholder')}
                            label={t('auth.signup.form.username.label')}
                        />
                    </SignUpComponentWrapper>
                    <SignUpComponentWrapper>
                        <Input
                            name="email"
                            placeholder={t('auth.signup.form.login.placeholder')}
                            label={t('auth.signup.form.login.label')}
                        />
                    </SignUpComponentWrapper>
                    <SignUpComponentWrapper>
                        <PasswordInput
                            name="password"
                            placeholder={t('auth.signup.form.password.placeholder')}
                            label={t('auth.signup.form.password.label')}
                            validationRules={passwordValidationRules}
                        />
                    </SignUpComponentWrapper>
                    <SignUpComponentWrapper>
                        <UserAgreementCheckbox />
                    </SignUpComponentWrapper>
                    <SignUpComponentWrapper>
                        <PrivacyNotice />
                    </SignUpComponentWrapper>
                    <SignUpButton disabled={loadingState === LoadingState.Loading} label={submitButtonLabel} />
                </SignUpFormWrapper>
            )}
        </Formik>
    )
}

export default EmailSignUpForm
