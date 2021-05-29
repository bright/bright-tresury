import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Loader } from '../../../components/loading/Loader'
import VerifyEmailError from './VerifyEmailError'
import VerifyEmailSuccess from './VerifyEmailSuccess'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../AuthContext'

const TOKEN_PARAM_NAME = 'token'

const VerifyEmail = () => {
    const { t } = useTranslation()
    const location = useLocation()
    const { verifyEmail } = useAuth()
    const [success, setSuccess] = useState<boolean | undefined>()

    useEffect(() => {
        const token = new URLSearchParams(location.search).get(TOKEN_PARAM_NAME)
        if (!token) {
            setSuccess(false)
            return
        }
        verifyEmail(token)
            .then((response) => {
                setSuccess(true)
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
