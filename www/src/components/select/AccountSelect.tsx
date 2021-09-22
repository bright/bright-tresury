import React from 'react'
import { Account } from '../../substrate-lib/accounts/AccountsContext'
import { useAccounts } from '../../substrate-lib/accounts/useAccounts'
import FormSelect from './FormSelect'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

export const EMPTY_ACCOUNT = {
    name: i18next.t('substrate.form.selectAccount'),
    address: '',
} as Account

interface OwnProps {
    showLabel?: boolean
    showOnlyAllowedInNetwork?: boolean
}

export type AccountSelectProps = OwnProps

const AccountSelect = ({ showLabel = true, showOnlyAllowedInNetwork = false }: AccountSelectProps) => {
    const { t } = useTranslation()

    const { accounts } = useAccounts()
    const filteredAccounts = showOnlyAllowedInNetwork
        ? accounts.filter(({ allowedInNetwork }: Account) => allowedInNetwork)
        : accounts

    return (
        <FormSelect
            variant={'outlined'}
            name="account"
            label={showLabel === true ? t('substrate.form.selectAccount') : undefined}
            options={[EMPTY_ACCOUNT, ...filteredAccounts]}
            renderOption={(value: Account) => {
                return value.name ?? value.address
            }}
        />
    )
}

export default AccountSelect
