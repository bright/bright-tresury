import React, { useState } from 'react'
import Container from '../../components/form/Container'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { breakpoints } from '../../theme/theme'
import newPassword from '../../assets/new_password.svg'
import { Trans, useTranslation } from 'react-i18next'
import { Formik } from 'formik'
import { SignComponentWrapper } from '../sign-components/SignComponentWrapper'
import RouterLink from '../../components/link/RouterLink'
import { ROUTE_SIGNIN, ROUTE_SIGNUP } from '../../routes/routes'
import { SignFormWrapper } from '../sign-components/SignFormWrapper'
import Button from '../../components/button/Button'
import PasswordInput from '../../components/form/input/password/PasswordInput'
import { fullValidatorForSchema } from '../../util/form.util'
import useNewPasswordValidation from './useNewPasswordValidation'
import { useNewPassword } from './new-password.api'
import { useHistory, useLocation } from 'react-router-dom'
import InfoBox from '../../components/form/InfoBox'
import { useSnackNotifications } from '../../snack-notifications/useSnackNotifications'

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
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
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

const TOKEN_PARAM_NAME = 'token'

export function NewPassword() {
    const classes = useStyles()
    const location = useLocation()
    const { t } = useTranslation()
    const { validationSchema, passwordValidationRules } = useNewPasswordValidation()
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { mutateAsync } = useNewPassword()
    const token = new URLSearchParams(location.search).get(TOKEN_PARAM_NAME) ?? ''
    const { open: openSnack } = useSnackNotifications()
    const history = useHistory()

    const onSuccess = (data: any) => {
        if (data.status === 'OK') {
            setSuccess(true)
            setError(null)
            openSnack('A new password has been set. Now you can log in.')
            history.replace(ROUTE_SIGNIN)
        } else if (data.status === 'RESET_PASSWORD_INVALID_TOKEN_ERROR') {
            setError(t('auth.errors.tokenError'))
        } else {
            setError(t('auth.errors.generalError'))
        }
    }

    const onSubmit = async (values: { password: string }) => {
        await mutateAsync(
            { ...values, token },
            {
                onSuccess,
                onError: () => {
                    setError(t('auth.errors.generalError'))
                },
            },
        )
    }

    return (
        <Container title={t('auth.newPassword.title')}>
            <img className={classes.image} src={newPassword} alt={''} />
            <div className={classes.textContainer}>
                <div>
                    <strong>{t('auth.newPassword.header')}</strong>
                </div>
            </div>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    password: '',
                }}
                validate={fullValidatorForSchema(validationSchema)}
                onSubmit={onSubmit}
            >
                {({ handleSubmit }) => (
                    <SignFormWrapper handleSubmit={handleSubmit}>
                        <SignComponentWrapper>
                            <PasswordInput
                                name="password"
                                label={t('auth.newPassword.label')}
                                placeholder={t('auth.newPassword.placeholder')}
                                validationRules={passwordValidationRules}
                            />
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
                                <InfoBox message={t('auth.newPassword.success')} level={'info'} />
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

export default NewPassword
