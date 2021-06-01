import React, {useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {useLocation} from 'react-router-dom'
import {Loader} from '../../components/loading/Loader'
import {useAuth} from '../AuthContext'
import {useVerifyEmail} from "./verify-email.api";
import VerifyEmailError from './VerifyEmailError'
import VerifyEmailSuccess from './VerifyEmailSuccess'

const TOKEN_PARAM_NAME = 'token'

const VerifyEmail = () => {
    const { t } = useTranslation()
    const location = useLocation()
    const { refreshJwt } = useAuth()
    const {isSuccess, isLoading, mutateAsync} = useVerifyEmail()

    useEffect(() => {
        const token = new URLSearchParams(location.search).get(TOKEN_PARAM_NAME)
        if (!token) {
            return
        }
        mutateAsync(token, {onSuccess: refreshJwt})
    }, [location.search])

    if (isLoading) {
        return <Loader text={t('loading.verifyEmail')} />
    }

    return isSuccess ? <VerifyEmailSuccess /> : <VerifyEmailError />
}

export default VerifyEmail
