import React, { useState } from 'react'
import { useAuth } from '../../AuthContext'
import Web3AccountDetails from './Web3AccountDetails'
import Web3AccountForm from './Web3AccountForm'
import { Button } from '../../../components/button/Button'
import { useTranslation } from 'react-i18next'

const Web3Account = () => {
    const { user } = useAuth()
    const { t } = useTranslation()
    const [addAccount, setAddAccount] = useState(false)

    return (
        <>
            {user?.isWeb3 || <Web3AccountDetails />}
            {addAccount ? (
                <Web3AccountForm />
            ) : (
                <Button variant="text" color="primary" onClick={() => setAddAccount(true)}>
                    {t('account.web3.add')}
                </Button>
            )}
        </>
    )
}

export default Web3Account
