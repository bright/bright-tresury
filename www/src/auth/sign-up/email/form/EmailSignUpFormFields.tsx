import React from 'react'
import { useTranslation } from 'react-i18next'
import Input from '../../../../components/form/input/Input'
import PasswordInput from '../../../../components/form/input/password/PasswordInput'
import { SignComponentWrapper } from '../../../sign-components/SignComponentWrapper'
import { PrivacyNotice } from '../../common/PrivacyNotice'
import { UserAgreementCheckbox } from '../../common/UserAgreementCheckbox'
import useSignUpForm, { SignUpValues } from './useSignUpForm'
import { FormikValues } from 'formik'
import DisabledFormField from '../../../account/emailPassword/components/DisabledFormField'

interface OwnProps {
    initialValues?: SignUpValues
}
export type EmailSignUpFormFieldsProps = OwnProps

const EmailSignUpFormFields = ({ initialValues }: EmailSignUpFormFieldsProps) => {
    const { t } = useTranslation()
    const { passwordValidationRules } = useSignUpForm()
    return (
        <>
            <SignComponentWrapper>
                {initialValues?.username ? (
                    <DisabledFormField title={t('account.emailPassword.username')} value={initialValues?.username} />
                ) : (
                    <Input
                        name="username"
                        placeholder={t('auth.signUp.emailSignUp.form.username.placeholder')}
                        label={t('auth.signUp.emailSignUp.form.username.label')}
                    />
                )}
            </SignComponentWrapper>
            <SignComponentWrapper>
                <Input
                    name="email"
                    placeholder={t('auth.signUp.emailSignUp.form.login.placeholder')}
                    label={t('auth.signUp.emailSignUp.form.login.label')}
                />
            </SignComponentWrapper>
            <SignComponentWrapper>
                <PasswordInput
                    name="password"
                    placeholder={t('auth.signUp.emailSignUp.form.password.placeholder')}
                    label={t('auth.signUp.emailSignUp.form.password.label')}
                    validationRules={passwordValidationRules}
                />
            </SignComponentWrapper>
            <SignComponentWrapper>
                <UserAgreementCheckbox />
            </SignComponentWrapper>
            <SignComponentWrapper>
                <PrivacyNotice />
            </SignComponentWrapper>
        </>
    )
}

export default EmailSignUpFormFields
