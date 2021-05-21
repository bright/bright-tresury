import React from 'react'
import { Account } from '../../substrate-lib/accounts/AccountsContext'
import { FormSelect } from './FormSelect'
import { ISelect } from './Select'
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

const TypedSelect = FormSelect as ISelect<Account>

export const EMPTY_ACCOUNT = {
    name: i18next.t('substrate.form.selectAccount'),
    address: '',
} as Account

interface OwnProps {
    accounts: Account[]
}

export const AccountSelect: React.FC<OwnProps> = ({ accounts }) => {
    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <TypedSelect
            className={classes.root}
            variant={'outlined'}
            name="account"
            label={t('substrate.form.selectAccount')}
            options={[EMPTY_ACCOUNT, ...accounts]}
            renderOption={(value: Account) => {
                return value.name ?? value.address
            }}
        />
    )
}
