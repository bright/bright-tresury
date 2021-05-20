import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Formik } from 'formik'
import { FormikHelpers } from 'formik/dist/types'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { Button } from '../../components/button/Button'
import { FormFooterButtonsContainer } from '../../components/form/footer/FormFooterButtonsContainer'
import { CheckboxInput } from '../../components/form/input/CheckboxInput'
import { Input } from '../../components/form/input/Input'
import { PasswordInput } from '../../components/form/input/password/PasswordInput'
import { Link } from '../../components/link/Link'
import { Label } from '../../components/text/Label'
import { fullValidatorForSchema } from '../../util/form.util'
import { SuperTokensAPIResponse, useSuperTokensRequest } from '../supertokens.utils/useSuperTokensRequest'
import { LoadingState } from '../../components/loading/useLoading'
import { SignUpSuccess } from './common/SignUpSuccess'

const useStyles = makeStyles(() =>
    createStyles({
        form: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
        },
        inputField: {
            marginTop: '2em',
            width: '100%',
        },
        link: {
            textDecoration: 'underline',
        },
        login: {
            textAlign: 'center',
            fontSize: '14px',
        },
    }),
)

interface SignUpValues {
    username: string
    email: string
    password: string
    userAgreement: boolean
}

interface OwnProps {
    submit: (values: SignUpValues) => Promise<SuperTokensAPIResponse>
    submitButtonLabel: string
}

export type SignupFormProps = OwnProps

const SignUpForm = ({ submit, submitButtonLabel }: SignupFormProps) => {
    const { t } = useTranslation()
    const classes = useStyles()

    const { call, loadingState } = useSuperTokensRequest(submit)

    const onSubmit = async (values: SignUpValues, { setErrors }: FormikHelpers<SignUpValues>) => {
        await call(values, setErrors)
    }

    const validationSchema = Yup.object().shape({
        username: Yup.string().required(t('auth.signup.form.emptyFieldError')),
        email: Yup.string()
            .email(t('auth.signup.form.login.emailError'))
            .required(t('auth.signup.form.emptyFieldError')),
        password: Yup.string()
            .min(8, t('auth.signup.form.password.tooShort'))
            .matches(/[a-z]+/, t('auth.signup.form.password.useLowerCaseLetter'))
            .matches(/[0-9]+/, t('auth.signup.form.password.useNumber')),
        userAgreement: Yup.boolean().isTrue(t('auth.signup.form.userAgreement.emptyFieldError')),
    })
    const passwordValidationRules = validationSchema.fields.password.tests.map(
        ({ OPTIONS }) => OPTIONS.message?.toString() || '',
    )

    if (loadingState === LoadingState.Resolved) {
        return <SignUpSuccess />
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
                <form className={classes.form} autoComplete="off" onSubmit={handleSubmit}>
                    <div className={classes.inputField}>
                        <Input
                            name="username"
                            placeholder={t('auth.signup.form.username.placeholder')}
                            label={t('auth.signup.form.username.label')}
                        />
                    </div>
                    <div className={classes.inputField}>
                        <Input
                            name="email"
                            placeholder={t('auth.signup.form.login.placeholder')}
                            label={t('auth.signup.form.login.label')}
                        />
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
                            label={
                                <Trans
                                    id="privacy-notice"
                                    i18nKey="auth.signup.form.userAgreement.label"
                                    components={{ a: <Link className={classes.link} href="" /> }}
                                />
                            }
                        />
                    </div>
                    <div className={classes.inputField}>
                        <Label
                            label={
                                <Trans
                                    id="privacy-notice"
                                    i18nKey="auth.signup.form.privacyNotice"
                                    components={{ a: <Link className={classes.link} href="" /> }}
                                />
                            }
                        />
                    </div>
                    <FormFooterButtonsContainer>
                        <Button
                            disabled={loadingState === LoadingState.Loading}
                            variant="contained"
                            color="primary"
                            type="submit"
                        >
                            {submitButtonLabel}
                        </Button>
                    </FormFooterButtonsContainer>
                </form>
            )}
        </Formik>
    )
}

export default SignUpForm
