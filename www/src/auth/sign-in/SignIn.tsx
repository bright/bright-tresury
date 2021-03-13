import {Typography} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Formik} from "formik";
import {FormikHelpers} from "formik/dist/types";
import React from "react";
import {Trans, useTranslation} from "react-i18next";
import * as Yup from "yup";
import loginImg from "../../assets/login.svg";
import {Button} from "../../components/button/Button";
import Container from "../../components/form/Container";
import {Input} from "../../components/form/input/Input";
import {PasswordInput} from "../../components/form/input/password/PasswordInput";
import {RouterLink} from "../../components/link/RouterLink";
import {LoadingState, useLoading} from "../../components/loading/LoadingWrapper";
import {ROUTE_SIGNUP} from "../../routes";
import {breakpoints} from "../../theme/theme";
import {useAuth} from "../AuthContext";
import {useSuperTokensRequest} from "../supertokens.utils/useSuperTokensRequest";
import { FormErrorLabel } from "../../components/form/FormErrorLabel";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        form: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        inputField: {
            marginTop: '2em',
            width: '50%',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                width: '75%',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                paddingLeft: '1em',
                paddingRight: '1em',
                width: '100%',
            },
        },
        buttons: {
            display: 'flex',
            flexDirection: 'column',
        },
        button: {
            marginTop: '3em',
        },
        link: {
            textDecoration: 'underline',
        },
        signup: {
            textAlign: 'center',
            fontSize: '14px',
            marginTop: '3em',
        },
        image: {
            margin: '3em 0',
            flexGrow: 1,
            maxWidth: '320px',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                maxWidth: '75%',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                paddingLeft: '1em',
                paddingRight: '1em',
                maxWidth: '100%',
            },
        },
    }),
);

interface SignInValues {
    email: string,
    password: string,
}

const SignIn: React.FC = () => {
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

    return <Container title={t('auth.signIn.title')}>
        <Formik
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
                <form className={classes.form} autoComplete='off' onSubmit={handleSubmit}>
                    <img className={classes.image} src={loginImg} alt={''}/>
                    {loadingState === LoadingState.Error && error && <FormErrorLabel className={classes.inputField} error={error}/>}
                    <div className={classes.inputField}>
                        <Input
                            name='email'
                            label={t('auth.signIn.form.login.label')}
                            placeholder={t('auth.signIn.form.login.placeholder')}/>
                    </div>
                    <div className={classes.inputField}>
                        <PasswordInput
                            name='password'
                            label={t('auth.signIn.form.password.label')}
                            placeholder={t('auth.signIn.form.password.placeholder')}/>
                    </div>
                    <div className={classes.buttons}>
                        <Button className={classes.button}
                                disabled={loadingState === LoadingState.Loading}
                                variant='contained'
                                color='primary'
                                type='submit'>
                            {t('auth.signIn.form.submitButton')}
                        </Button>
                        <Button className={classes.button}
                                variant='text'
                                color='default'
                                type='button'>
                            {t('auth.signIn.form.forgotPassword')}
                        </Button>
                    </div>
                    <Typography className={classes.signup}>
                        {<Trans id='privacy-notice'
                                i18nKey='auth.signIn.signUpLabel'
                                components={{a: <RouterLink to={ROUTE_SIGNUP}/>}}/>}
                    </Typography>
                </form>
            }
        </Formik>
    </Container>
}

export default SignIn
