import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Formik } from 'formik'
import React from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import Button from '../../../../components/button/Button'
import InfoBox from '../../../../components/form/InfoBox'
import Input from '../../../../components/form/input/Input'
import { ClassNameProps } from '../../../../components/props/className.props'
import { useAuth } from '../../../AuthContext'
import { SignComponentWrapper } from '../../../sign-components/SignComponentWrapper'
import { useGetUserSettings, usePatchUserSettings } from '../../user-settings.api'

const useStyles = makeStyles(() =>
    createStyles({
        form: {
            display: 'flex',
            alignItems: 'flex-end',
        },
        button: {
            marginLeft: '24px',
            marginBottom: '4px',
        },
    }),
)

interface OwnProps {
    userId: string
    username: string
    onClose: () => void
}

type UsernameEditProps = OwnProps & ClassNameProps

const UsernameEdit = ({ userId, username, onClose }: UsernameEditProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { refetch } = useGetUserSettings({ userId })
    const { refreshSession } = useAuth()
    const { mutateAsync, isLoading, isError } = usePatchUserSettings()

    const validationSchema = Yup.object().shape({
        username: Yup.string().required(t('auth.signUp.emptyFieldError')),
    })

    const onSubmit = async ({ username }: { username: string }) => {
        await mutateAsync(
            { userId, dto: { username } },
            {
                onSuccess: async () => {
                    await refetch()
                    await refreshSession()
                    onClose()
                },
            },
        )
    }

    return (
        <Formik
            enableReinitialize={true}
            initialValues={{ username }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ handleSubmit }) => (
                <form className={classes.form} autoComplete="off" onSubmit={handleSubmit}>
                    <SignComponentWrapper>
                        <Input
                            name="username"
                            placeholder={t('account.emailPassword.username')}
                            label={t('account.emailPassword.username')}
                        />
                    </SignComponentWrapper>
                    {isError ? (
                        <SignComponentWrapper>
                            <InfoBox message={t('errors.somethingWentWrong')} level={'error'} />
                        </SignComponentWrapper>
                    ) : null}
                    <Button color={'primary'} className={classes.button} type="submit" disabled={isLoading}>
                        {t('account.emailPassword.saveUsername')}
                    </Button>
                    <Button
                        color={'primary'}
                        variant={'text'}
                        className={classes.button}
                        disabled={isLoading}
                        onClick={onClose}
                    >
                        {t('account.emailPassword.cancelChangeUsername')}
                    </Button>
                </form>
            )}
        </Formik>
    )
}

export default UsernameEdit
