import {Formik} from 'formik'
import {FormikHelpers} from 'formik/dist/types'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {InfoBox} from "../../../../components/form/InfoBox";
import {fullValidatorForSchema, toFormikErrors} from '../../../../util/form.util'
import {useAuth} from "../../../AuthContext";
import {SignComponentWrapper} from '../../../sign-components/SignComponentWrapper'
import {SignFormWrapper} from '../../../sign-components/SignFormWrapper'
import {SignUpButton} from '../../common/SignUpButton'
import EmailSignUpSuccess from '../EmailSignUpSucces'
import {useSignUp} from "../sign-up-email.api";
import {FieldError} from "../sign-up-email.dto";
import EmailSignUpFormFields from "./EmailSignUpFormFields";
import useSignUpForm, { SignUpValues } from "./useSignUpForm";

const EmailSignUpForm = () => {
    const {t} = useTranslation()
    const {initialValues, validationSchema} = useSignUpForm()
    const {setIsUserSignedIn} = useAuth()
    const {mutateAsync, isError, isLoading, isSuccess} = useSignUp()

    const onSubmit = async (values: SignUpValues, {setErrors}: FormikHelpers<SignUpValues>) => {
        await mutateAsync(values, {
            onSuccess: () => {
                setIsUserSignedIn(true)
            },
            onError: (err) => {
                setErrors(toFormikErrors(err as FieldError))
                setIsUserSignedIn(false)
            }
        })
    }

    if (isSuccess) {
        return <EmailSignUpSuccess/>
    }

    return (
        <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            validate={fullValidatorForSchema(validationSchema)}
            onSubmit={onSubmit}
        >
            {({handleSubmit, isValid}) => (
                <SignFormWrapper handleSubmit={handleSubmit}>
                    <EmailSignUpFormFields/>
                    {(isError && isValid) ? <SignComponentWrapper>
                        <InfoBox message={t('auth.errors.generalError')} level={'error'}/>
                    </SignComponentWrapper> : null}
                    <SignUpButton disabled={isLoading}/>
                </SignFormWrapper>
            )
            }
        </Formik>
    )
}

export default EmailSignUpForm
