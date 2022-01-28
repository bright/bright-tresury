import React from 'react'
import { useAuth, UserStatus } from '../../AuthContext'
import EmailPasswordAccountDetails from './EmailPasswordAccountDetails'
import EmailPasswordAccountForm from './EmailPasswordAccountForm'

const EmailPasswordAccount = () => {
    const { user } = useAuth()

    return user?.status === UserStatus.EmailPasswordEnabled ? (
        <EmailPasswordAccountDetails />
    ) : (
        <EmailPasswordAccountForm />
    )
}

export default EmailPasswordAccount
