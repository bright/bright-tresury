import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import Loader from '../../components/loading/Loader'
import { Nil } from '../../util/types'
import { useAuth } from '../AuthContext'
import { useVerifyEmail } from './verifyEmail.api'
import VerifyEmailError from './VerifyEmailError'
import VerifyEmailSuccess from './VerifyEmailSuccess'

const TOKEN_PARAM_NAME = 'token'

const VerifyEmail = () => {
    const { t } = useTranslation()
    const location = useLocation()
    const [token, setToken] = useState<Nil<string>>()
    const { mutateAsync, isLoading, isSuccess, isIdle } = useVerifyEmail()
    const { isUserSignedIn, refreshJwt } = useAuth()

    useEffect(() => {
        const t = new URLSearchParams(location.search).get(TOKEN_PARAM_NAME)
        if (t) {
            setToken(t)
        }
    }, [location.search])

    useEffect(() => {
        if (token) {
            mutateAsync(token, {
                onSuccess: () => {
                    if (isUserSignedIn) {
                        refreshJwt()
                    }
                },
            })
        }
    }, [token])

    if (isLoading || isIdle) {
        return <Loader text={t('loading.verifyEmail')} />
    }

    return isSuccess ? <VerifyEmailSuccess /> : <VerifyEmailError />
}

export default VerifyEmail
