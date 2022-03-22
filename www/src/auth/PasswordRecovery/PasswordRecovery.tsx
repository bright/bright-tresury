import React, { useState } from 'react'
import Container from '../../components/form/Container'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { breakpoints } from '../../theme/theme'
import forgotPassword from '../../assets/forgot_password.svg'
import { Trans, useTranslation } from 'react-i18next'
import { Formik } from 'formik'
import Input from '../../components/form/input/Input'
import { SignComponentWrapper } from '../sign-components/SignComponentWrapper'
import RouterLink from '../../components/link/RouterLink'
import { ROUTE_SIGNUP } from '../../routes/routes'
import { SignFormWrapper } from '../sign-components/SignFormWrapper'
import Button from '../../components/button/Button'
import { usePasswordRecovery } from './password-recovery.api'
import InfoBox from '../../components/form/InfoBox'
import { fullValidatorForSchema } from '../../util/form.util'
import * as Yup from 'yup'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        image: {
            alignSelf: 'center',
            margin: '3em 0',
            flexGrow: 1,
            height: '163px',
            width: '273px',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                paddingLeft: '1em',
                paddingRight: '1em',
            },
        },
        textContainer: {
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexDirection: 'column',
            height: '80px',
            textAlign: 'center',
        },
        signUpLabel: {
            textAlign: 'center',
            fontSize: '14px',
            marginTop: '3em',
        },
        resetButton: {
            marginTop: '30px',
        },
    }),
)

export function PasswordRecovery() {
    const classes = useStyles()
    const { t } = useTranslation()
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { mutateAsync } = usePasswordRecovery()

    const onSubmit = async (values: { email: string }) => {
        await mutateAsync(values, {
            onSuccess: (data: any) => {
                if (data.status === 'OK') {
                    setSuccess(true)
                    setError(null)
                } else {
                    setError(t('auth.errors.generalError'))
                }
            },
            onError: () => {
                setError(t('auth.errors.generalError'))
            },
        })
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email(t('auth.signUp.emailSignUp.form.login.emailError'))
            .required(t('auth.signUp.emptyFieldError')),
    })

    return (
        <Container title={t('auth.passwordRecovery.title')}>
            <img className={classes.image} src={forgotPassword} alt={''} />
            <div className={classes.textContainer}>
                <div>
                    <strong>{t('auth.passwordRecovery.header')}</strong>
                </div>
                <div>{t('auth.passwordRecovery.paragraph')}</div>
            </div>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    email: '',
                }}
                validate={fullValidatorForSchema(validationSchema)}
                onSubmit={onSubmit}
            >
                {({ handleSubmit }) => (
                    <SignFormWrapper handleSubmit={handleSubmit}>
                        <SignComponentWrapper>
                            <Input name="email" />
                        </SignComponentWrapper>
                        <Button className={classes.resetButton} variant="contained" color="primary" type="submit">
                            {t('auth.passwordRecovery.reset')}
                        </Button>
                        {error ? (
                            <SignComponentWrapper>
                                <InfoBox message={error} level={'error'} />
                            </SignComponentWrapper>
                        ) : success ? (
                            <SignComponentWrapper>
                                <InfoBox message={t('auth.passwordRecovery.success')} level={'info'} />
                            </SignComponentWrapper>
                        ) : null}
                    </SignFormWrapper>
                )}
            </Formik>
            <div className={classes.signUpLabel}>
                <Trans
                    i18nKey="auth.signIn.signUpLabel"
                    components={{ a: <RouterLink to={ROUTE_SIGNUP} replace={true} /> }}
                />
            </div>
        </Container>
    )
}

export default PasswordRecovery
