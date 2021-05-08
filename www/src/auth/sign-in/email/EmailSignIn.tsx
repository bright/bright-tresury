import {createStyles, makeStyles} from "@material-ui/core/styles";
import {Formik} from "formik";
import {FormikHelpers} from "formik/dist/types";
import React from "react";
import {useTranslation} from "react-i18next";
import * as Yup from "yup";
import {Button} from "../../../components/button/Button";
import {InfoBox} from "../../../components/form/InfoBox";
import {Input} from "../../../components/form/input/Input";
import {PasswordInput} from "../../../components/form/input/password/PasswordInput";
import {LoadingState} from "../../../components/loading/LoadingWrapper";
import {useAuth} from "../../AuthContext";
import {useSuperTokensRequest} from "../../supertokens.utils/useSuperTokensRequest";
import {SignUpLabel} from "../common/SignUpLabel";
import {SignInButton} from "../common/SignInButton";
import {SignFormWrapper} from "../../sign-components/SignFormWrapper";
import {SignComponentWrapper} from "../../sign-components/SignComponentWrapper";

const useStyles = makeStyles(() =>
    createStyles({
        forgotPasswordButton: {
            marginTop: '3em',
        },
    }),
);

interface SignInValues {
    email: string,
    password: string,
}

const EmailSignIn = () => {
    const {t} = useTranslation()
    const classes = useStyles()

    const {signIn} = useAuth()

    const {loadingState, call, error} = useSuperTokensRequest(signIn)

    const onSubmit = async (values: SignInValues, {setErrors}: FormikHelpers<SignInValues>) => {
        await call(values, setErrors)
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string().required(t('auth.signup.form.emptyFieldError')),
    })

    return <Formik
        enableReinitialize={true}
        initialValues={{
            email: '',
            password: '',
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}>
        {({
              values,
              handleSubmit,
          }) =>
            <SignFormWrapper handleSubmit={handleSubmit}>
                {(loadingState === LoadingState.Error && error) ? <SignComponentWrapper>
                    <InfoBox message={error} level={"error"}/>
                </SignComponentWrapper> : null}
                <SignComponentWrapper>
                    <Input
                        name='email'
                        label={t('auth.signIn.emailSignIn.login.label')}
                        placeholder={t('auth.signIn.emailSignIn.login.placeholder')}/>
                </SignComponentWrapper>
                <SignComponentWrapper>
                    <PasswordInput
                        name='password'
                        label={t('auth.signIn.emailSignIn.password.label')}
                        placeholder={t('auth.signIn.emailSignIn.password.placeholder')}/>
                </SignComponentWrapper>
                <SignInButton disabled={loadingState === LoadingState.Loading}/>
                <Button className={classes.forgotPasswordButton}
                        variant='text'
                        color='default'
                        type='button'>
                    {t('auth.signIn.emailSignIn.forgotPassword')}
                </Button>
                <SignUpLabel/>
            </SignFormWrapper>
        }
    </Formik>
}

export default EmailSignIn
