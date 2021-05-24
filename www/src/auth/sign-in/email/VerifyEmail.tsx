import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Loader } from '../../../components/loading/Loader'
import { verifyEmail } from '../../auth.api'
import VerifyEmailError from './VerifyEmailError'
import VerifyEmailSuccess from './VerifyEmailSuccess'
import { useTranslation } from 'react-i18next'

const TOKEN_PARAM_NAME = 'token'

const VerifyEmail = () => {
    const { t } = useTranslation()
    const location = useLocation()
    const [success, setSuccess] = useState<boolean | undefined>()

    useEffect(() => {
        const token = new URLSearchParams(location.search).get(TOKEN_PARAM_NAME)
        if (!token) {
            setSuccess(false)
            return
        }
        verifyEmail(token)
            .then((response) => {
                if (response.status === 'OK') {
                    setSuccess(true)
                } else if (response.status === 'EMAIL_VERIFICATION_INVALID_TOKEN_ERROR') {
                    setSuccess(false)
                }
            })
            .catch((err) => {
                setSuccess(false)
                console.log(err)
            })
    }, [location.search])

    if (success === undefined) {
        return <Loader text={t('loading.verifyEmail')} />
    }

    return success ? <VerifyEmailSuccess /> : <VerifyEmailError />
}

export default VerifyEmail
