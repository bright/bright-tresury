import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Formik } from 'formik'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { InfoBox } from '../../../components/form/InfoBox'
import { Input } from '../../../components/form/input/Input'
import PasswordInput from '../../../components/form/input/password/PasswordInput'
import { useAuth } from '../../AuthContext'
import { SignComponentWrapper } from '../../sign-components/SignComponentWrapper'
import { SignFormWrapper } from '../../sign-components/SignFormWrapper'
import { SignOption } from '../../sign-components/SignOption'
import { NotSignedUpYet } from '../common/NotSignedUpYet'
import { SignInButton } from '../common/SignInButton'
import { useSignIn } from './emailSignIn.api'

const useStyles = makeStyles(() =>
    createStyles({
        forgotPasswordButton: {
            marginTop: '3em',
        },
    }),
)

interface SignInValues {
    email: string
    password: string
}

const EmailSignIn = () => {
    const { t } = useTranslation()
    const classes = useStyles()

    const { setIsUserSignedIn } = useAuth()

    const { isLoading, isError, mutateAsync, error } = useSignIn()

    const onSubmit = async (values: SignInValues) => {
        await mutateAsync(values, {
            onSuccess: () => {
                setIsUserSignedIn(true)
            },
            onError: () => {
                setIsUserSignedIn(false)
            },
        })
    }

    const errorMessage = useMemo(() => {
        if (!isError) {
            return undefined
        }
        const typedError = error as Error
        return typedError?.message === 'WRONG_CREDENTIALS_ERROR'
            ? t('auth.errors.wrongCredentialsError')
            : t('auth.errors.generalError')
    }, [error])

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
                    {/*Hidden due to TREAS-128. Feature is not implemented yet*/}
                    {/*<Button className={classes.forgotPasswordButton} variant="text" color="default" type="button">*/}
                    {/*    {t('auth.signIn.emailSignIn.forgotPassword')}*/}
                    {/*</Button>*/}
                    <NotSignedUpYet signOption={SignOption.Email} />
                </SignFormWrapper>
            )}
        </Formik>
    )
}

export default EmailSignIn
