import React from 'react'
import { useTranslation } from 'react-i18next'
import Button, { ButtonProps } from '../../components/button/Button'
import { useSendVerifyEmail } from './verifyEmail.api'

export type SendVerifyEmailButtonProps = Omit<ButtonProps, 'children'>

const SendVerifyEmailButton = (props: SendVerifyEmailButtonProps) => {
    const { t } = useTranslation()

    const { mutateAsync, status, error } = useSendVerifyEmail()

    const onClick = async () => {
        try {
            await mutateAsync()
        } catch {}
    }

    switch (status) {
        case 'loading':
            return (
                <Button disabled={true} color="primary" onClick={onClick} {...props}>
                    {t('auth.emailNotVerified.resendEmail')}
                </Button>
            )
        case 'success':
            return <p>{t('auth.emailNotVerified.emailResent')}</p>
        case 'error':
            return (error as any)?.message === 'EMAIL_ALREADY_VERIFIED_ERROR' ? (
                <p>{t('auth.emailNotVerified.emailAlreadyVerifiedError')}</p>
            ) : (
                <p>{t('auth.emailNotVerified.emailSendingError')}</p>
            )
        default:
            return (
                <Button color="primary" onClick={onClick} {...props}>
                    {t('auth.emailNotVerified.resendEmail')}
                </Button>
            )
    }
}

export default SendVerifyEmailButton
