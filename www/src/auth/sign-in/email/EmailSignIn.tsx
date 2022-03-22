import { Formik } from 'formik'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import InfoBox from '../../../components/form/InfoBox'
import Input from '../../../components/form/input/Input'
import PasswordInput from '../../../components/form/input/password/PasswordInput'
import { SignComponentWrapper } from '../../sign-components/SignComponentWrapper'
import { SignFormWrapper } from '../../sign-components/SignFormWrapper'
import { SignOption } from '../../sign-components/SignOption'
import NotSignedUpYet from '../common/NotSignedUpYet'
import { SignInButton } from '../common/SignInButton'
import { useSignIn } from './emailSignIn.api'
import PasswordRecoveryLink from '../common/PasswordRecoveryLink'

interface SignInValues {
    email: string
    password: string
}

const EmailSignIn = () => {
    const { t } = useTranslation()

    const { isLoading, isError, mutateAsync, error } = useSignIn()

    const onSubmit = async (values: SignInValues) => {
        await mutateAsync(values)
    }

    const errorMessage = useMemo(() => {
        if (!isError) {
            return undefined
        }
        const typedError = error as Error
        if (typedError?.message === 'WRONG_CREDENTIALS_ERROR') return t('auth.errors.wrongCredentialsError')
        else if (typedError?.message === 'ACCOUNT_TEMPORARY_LOCKED') return t('auth.errors.accountTemporaryLocked')
        else return t('auth.errors.generalError')
    }, [error, isError, t])

    const validationSchema = Yup.object().shape({
        email: Yup.string().required(t('auth.signIn.emailSignIn.emptyFieldError')),
    })

    return (
        <Formik
            enableReinitialize={true}
            initialValues={{
                email: '',
                password: '',
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ handleSubmit }) => (
                <SignFormWrapper handleSubmit={handleSubmit}>
                    {errorMessage ? (
                        <SignComponentWrapper>
                            <InfoBox message={errorMessage} level={'error'} />
                        </SignComponentWrapper>
                    ) : null}
                    <SignComponentWrapper>
                        <Input
                            name="email"
                            label={t('auth.signIn.emailSignIn.login.label')}
                            placeholder={t('auth.signIn.emailSignIn.login.placeholder')}
                        />
                    </SignComponentWrapper>
                    <SignComponentWrapper>
                        <PasswordInput
                            name="password"
                            label={t('auth.signIn.emailSignIn.password.label')}
                            placeholder={t('auth.signIn.emailSignIn.password.placeholder')}
                        />
                    </SignComponentWrapper>
                    <SignInButton disabled={isLoading} />
                    <NotSignedUpYet signOption={SignOption.Email} />
                    <PasswordRecoveryLink />
                </SignFormWrapper>
            )}
        </Formik>
    )
}

export default EmailSignIn
