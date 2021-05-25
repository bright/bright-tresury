import {AxiosError} from "axios";
import { Formik } from 'formik'
import { FormikHelpers } from 'formik/dist/types'
import React, {useMemo} from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import {InfoBox} from "../../../components/form/InfoBox";
import { Input } from '../../../components/form/input/Input'
import { PasswordInput } from '../../../components/form/input/password/PasswordInput'
import { fullValidatorForSchema } from '../../../util/form.util'
import { UserAgreementCheckbox } from '../common/UserAgreementCheckbox'
import { PrivacyNotice } from '../common/PrivacyNotice'
import { SignUpButton } from '../common/SignUpButton'
import EmailSignUpSuccess from './EmailSignUpSucces'
import {SignFormWrapper, SignFormWrapperStylesProps} from '../../sign-components/SignFormWrapper'
import { SignComponentWrapper } from '../../sign-components/SignComponentWrapper'
import { LoadingState, useLoading } from '../../../components/loading/useLoading'
import {FieldError} from "./sign-up-email.api";

export interface SignUpValues {
    username: string
    email: string
    password: string
    userAgreement: boolean
}

interface OwnProps {
    submit: (values: SignUpValues) => Promise<any>
    submitButtonLabel: string
}

export type SignupFormProps = OwnProps & SignFormWrapperStylesProps

const EmailSignUpForm = ({ submit, submitButtonLabel, ...signFormWrapperProps }: SignupFormProps) => {
    const { t } = useTranslation()

    const { call, loadingState, error } = useLoading(submit)

    const onSubmit = async (values: SignUpValues, { setErrors }: FormikHelpers<SignUpValues>) => {
        // TODO move to `useLoading` hook or use `react-query`
        await call(values)
        const typedError: FieldError = error as FieldError
        if (typedError) {
            const errors: any = {}
            typedError.formFieldErrors.forEach(({id, error}) => {
                errors[id] = error
            })
            await setErrors(errors)
            return
        }

    }

    const errorMessage = useMemo(() => {
        // TODO move to `useLoading` hook or use `react-query`
        const errorWithMessage = error as AxiosError
        if (errorWithMessage) {
            return errorWithMessage.response?.data?.message ?? errorWithMessage.message
        }
        const generalError = error as Error
        if (generalError) {
            return generalError.message
        }
        return null
    }, [error])


    const validationSchema = Yup.object().shape({
        username: Yup.string().required(t('auth.signUp.emptyFieldError')),
        email: Yup.string()
            .email(t('auth.signUp.emailSignUp.form.login.emailError'))
            .required(t('auth.signUp.emptyFieldError')),
        password: Yup.string()
            .min(8, t('auth.signUp.emailSignUp.form.password.tooShort'))
            .matches(/[a-z]+/, t('auth.signUp.emailSignUp.form.password.useLowerCaseLetter'))
            .matches(/[0-9]+/, t('auth.signUp.emailSignUp.form.password.useNumber')),
        userAgreement: Yup.boolean().isTrue(t('auth.signUp.userAgreement.emptyFieldError')),
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
                <SignFormWrapper handleSubmit={handleSubmit} {...signFormWrapperProps}>
                    <SignComponentWrapper>
                        <Input
                            name="username"
                            placeholder={t('auth.signUp.emailSignUp.form.username.placeholder')}
                            label={t('auth.signUp.emailSignUp.form.username.label')}
                        />
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

                    {errorMessage ? <SignComponentWrapper><InfoBox message={errorMessage} level={'error'}/></SignComponentWrapper> : null}
                    <SignUpButton disabled={loadingState === LoadingState.Loading} label={submitButtonLabel} />
                </SignFormWrapper>
            )}
        </Formik>
    )
}

export default EmailSignUpForm
