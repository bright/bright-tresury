import {Account} from "../../substrate-lib/components/SubmittingTransaction";
import React from "react";
import {FormSelect} from "./FormSelect";
import {ISelect} from "./Select";
import {useTranslation} from "react-i18next";
import {Theme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => {
    return {
        root: {
            background: theme.palette.background.default
        }
    }
})

const TypedSelect = FormSelect as ISelect<Account>

interface OwnProps {
    account: Account
    accounts: Account[]
}

export const AccountSelect: React.FC<OwnProps> = ({account, accounts}) => {
    const classes = useStyles()
    const {t} = useTranslation()
    const emptyAccount = {
        name: t('substrate.form.selectAccount'),
        address: ''
    } as Account

    return <TypedSelect
        className={classes.root}
        variant={"outlined"}
        name="account"
        label={t('substrate.form.selectAccount')}
        options={[emptyAccount, ...accounts]}
        value={account}
        renderOption={(value: Account) => {
            return value.name ?? value.address
        }}
    />
}
