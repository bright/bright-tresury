import { Formik } from 'formik'
import { FormikHelpers } from 'formik/dist/types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import InfoBox from '../../../../components/form/InfoBox'
import { ROUTE_SIGNUP_EMAIL_SUCCESS } from '../../../../routes/routes'
import { fullValidatorForSchema, toFormikErrors } from '../../../../util/form.util'
import { SignComponentWrapper } from '../../../sign-components/SignComponentWrapper'
import { SignFormWrapper } from '../../../sign-components/SignFormWrapper'
import { SignUpButton } from '../../common/SignUpButton'
import { useSignUp } from '../emailSignUp.api'
import { FieldError } from '../emailSignUp.dto'
import EmailSignUpFormFields from './EmailSignUpFormFields'
import useSignUpForm, { SignUpValues } from './useSignUpForm'

const EmailSignUpForm = () => {
    const { t } = useTranslation()
    const { initialValues, validationSchema } = useSignUpForm()
    const history = useHistory()
    const { mutateAsync, isError, isLoading } = useSignUp()
    const [showError, setShowError] = useState(true)

    const onSubmit = async (values: SignUpValues, { setErrors }: FormikHelpers<SignUpValues>) => {
        await mutateAsync(values, {
            onSuccess: () => {
                history.replace(ROUTE_SIGNUP_EMAIL_SUCCESS)
            },
            onError: (err) => {
                const formikErrors = toFormikErrors(err as FieldError)
                if (formikErrors) {
                    setErrors(formikErrors)
                    setShowError(false)
                } else {
                    setShowError(true)
                }
            },
        })
    }

    return (
        <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            validate={fullValidatorForSchema(validationSchema)}
            onSubmit={onSubmit}
        >
            {({ handleSubmit }) => (
                <SignFormWrapper handleSubmit={handleSubmit}>
                    <EmailSignUpFormFields />
                    {isError && showError ? (
                        <SignComponentWrapper>
                            <InfoBox message={t('auth.errors.generalError')} level={'error'} />
                        </SignComponentWrapper>
                    ) : null}
                    <SignUpButton disabled={isLoading} />
                </SignFormWrapper>
            )}
        </Formik>
    )
}

export default EmailSignUpForm
