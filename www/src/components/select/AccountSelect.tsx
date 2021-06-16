import React from 'react'
import { Account } from '../../substrate-lib/accounts/AccountsContext'
import FormSelect from './FormSelect'
import { useTranslation } from 'react-i18next'
import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import i18next from 'i18next'

const useStyles = makeStyles((theme: Theme) => {
    return {
        root: {
            background: theme.palette.background.default,
        },
    }
})

export const EMPTY_ACCOUNT = {
    name: i18next.t('substrate.form.selectAccount'),
    address: '',
} as Account

interface OwnProps {
    showLabel?: boolean
    accounts: Account[]
}

export type AccountSelectProps = OwnProps

const AccountSelect = ({ accounts, showLabel = true }: AccountSelectProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <FormSelect
            className={classes.root}
            variant={'outlined'}
            name="account"
            label={showLabel === true ? t('substrate.form.selectAccount') : undefined}
            options={[EMPTY_ACCOUNT, ...accounts]}
            renderOption={(value: Account) => {
                return value.name ?? value.address
            }}
        />
    )
}

export default AccountSelect
