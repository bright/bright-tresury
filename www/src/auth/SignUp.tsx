import {Checkbox} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Formik} from "formik";
import React from "react";
import {Trans, useTranslation} from "react-i18next";
import * as Yup from "yup";
import {Button} from "../components/button/Button";
import {ButtonsContainer} from "../components/form/buttons/ButtonsContainer";
import Container from "../components/form/Container";
import {CheckboxInput} from "../components/form/input/CheckboxInput";
import {Input} from "../components/form/input/Input";
import {PasswordInput} from "../components/form/password/PasswordInput";
import {Link} from "../components/link/Link";
import {Label} from "../components/text/Label";
import {signUp} from "./auth.api";
import FormControlLabel from "@material-ui/core/FormControlLabel";

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
        },
        link: {
            textDecoration: 'underline',
        }
    }),
);

interface SignUpValues {
    username: string,
    login: string,
    password: string,
    userAgreement: boolean
}

const SignUp: React.FC = () => {
    const {t} = useTranslation()
    const classes = useStyles()

    const onSubmit = async (values: SignUpValues) => {
        signUp(values)
            .then((result) => {
                console.log(result)
            })
            .catch((error) => {
                console.log(error)
            });
    }

    const validationSchema = Yup.object().shape({
        username: Yup.string().required(t('auth.signup.form.emptyFieldError')),
        login: Yup.string().email(t('auth.signup.form.login.emailError')).required(t('auth.signup.form.emptyFieldError')),
        password: Yup.string().required(t('auth.signup.form.emptyFieldError')).matches(/[A-Z]/, "Error A-Z").min(8, "Error"), // TODO: return multiple errors
        userAgreement: Yup.boolean().isTrue(t('auth.signup.form.userAgreement.emptyFieldError')),
    })

    return <Container title={t('auth.signup.title')}>
        <Formik
            enableReinitialize={true}
            initialValues={{
                username: '',
                login: '',
                password: '',
                userAgreement: false
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}>
            {({
                  values,
                  handleSubmit,
              }) =>
                <form className={classes.form} autoComplete="off" onSubmit={handleSubmit}>
                    <div className={classes.inputField}>
                        <Input
                            name="username"
                            placeholder={t('auth.signup.form.username.placeholder')}
                            label={t('auth.signup.form.username.label')}/>
                    </div>
                    <div className={classes.inputField}>
                        <Input
                            name="login"
                            placeholder={t('auth.signup.form.login.placeholder')}
                            label={t('auth.signup.form.login.label')}/>
                    </div>
                    <div className={classes.inputField}>
                        <PasswordInput
                            name="password"
                            placeholder={t('auth.signup.form.password.placeholder')}
                            label={t('auth.signup.form.password.label')}
                        />
                    </div>
                    <div className={classes.inputField}>
                        <CheckboxInput
                            name="userAgreement"
                            label={<Trans id='privacy-notice'
                                          i18nKey="auth.signup.form.userAgreement.label"
                                          components={{a: <Link className={classes.link} href=''/>}}/>}
                        />
                    </div>
                    <div className={classes.inputField}>
                        <Label label={<Trans id='privacy-notice'
                                             i18nKey="auth.signup.form.privacyNotice"
                                             components={{a: <Link className={classes.link} href=''/>}}/>}
                        />
                    </div>
                    <ButtonsContainer>
                        <Button variant="contained" color="primary" type='submit'>{t('auth.signup.form.submitButton')}</Button>
                    </ButtonsContainer>
                </form>
            }
        </Formik>
    </Container>
}

export default SignUp
