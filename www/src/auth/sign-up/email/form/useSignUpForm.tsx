import React from 'react'
import {useTranslation} from 'react-i18next'
import * as Yup from "yup";
import {ObjectSchema} from "yup";

export interface SignUpValues {
    username: string
    email: string
    password: string
    userAgreement: boolean
}

interface UseSignUpFormResult {
    validationSchema: ObjectSchema<any>
    passwordValidationRules: string[]
    initialValues: SignUpValues
}

const useSignUpForm = (): UseSignUpFormResult => {
    const {t} = useTranslation()

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
        ({OPTIONS}) => OPTIONS.message?.toString() || '',
    )

    const initialValues = {
        username: '',
        email: '',
        password: '',
        userAgreement: false,
    } as SignUpValues

    return {
        validationSchema,
        passwordValidationRules,
        initialValues
    }
}

export default useSignUpForm
