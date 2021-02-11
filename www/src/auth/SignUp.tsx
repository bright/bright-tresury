import {Typography} from "@material-ui/core";
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
import {PasswordInput} from "../components/form/input/password/PasswordInput";
import {Link} from "../components/link/Link";
import {RouterLink} from "../components/link/RouterLink";
import {Label} from "../components/text/Label";
import {ROUTE_SIGNIN} from "../routes";
import {breakpoints} from "../theme/theme";
import {validateFull} from "../util/form.util";
import {signUp} from "./auth.api";

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
        link: {
            textDecoration: 'underline',
        },
        login: {
            fontSize: '14px',
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
        password: Yup.string()
            .min(8, t('auth.signup.form.password.tooShort'))
            .matches(/[a-z]+/, t('auth.signup.form.password.useLowerCaseLetter'))
            .matches(/[0-9]+/, t('auth.signup.form.password.useNumber')),
        userAgreement: Yup.boolean().isTrue(t('auth.signup.form.userAgreement.emptyFieldError')),
    })
    const passwordValidationRules = validationSchema.fields.password.tests.map(({OPTIONS}) => OPTIONS.message?.toString() || '')

    return <Container title={t('auth.signup.title')}>
        <Formik
            enableReinitialize={true}
            initialValues={{
                username: '',
                login: '',
                password: '',
                userAgreement: false
            }}
            validate={validateFull(validationSchema)}
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
                            validationRules={passwordValidationRules}
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
                    <Typography className={classes.login}>
                        {<Trans id='privacy-notice'
                                i18nKey="auth.signup.logInLabel"
                                components={{a: <RouterLink to={ROUTE_SIGNIN}/>}}/>}
                    </Typography>
                </form>
            }
        </Formik>
    </Container>
}

export default SignUp
