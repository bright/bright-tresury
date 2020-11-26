import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {Formik} from "formik";
import React, {createRef, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Button} from "../../components/button/Button";
import {ISelect, Select} from "../../components/select/Select";
import {useSubstrate} from '../index';
import {TxAttrs, TxButton} from "./TxButton";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        form: {
            width: '100%',
            margin: 5
        },
        paper: {
            position: 'absolute',
            width: 400,
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
    }),
);

interface Props {
    network: string
    txAttrs: TxAttrs
}

const a = {
    palletRpc: 'treasury',
    callable: 'proposeSpend',
    inputParams: [
        {
            name: 'value',
            value: 10,
            type: 'Compact<Balance>'
        },
        {
            name: 'beneficiary',
            value: 'AAA',
        },
    ],
} as TxAttrs

interface Account {
    name: string,
    address: string
}

interface FormikState {
    account: Account
}

const TypedSelect = Select as ISelect<Account>

const TxSignAndSubmitForm: React.FC<Props> = ({network = 'localhost', txAttrs = a}) => {
    const classes = useStyles()
    const {t} = useTranslation()
    const emptyAccount = {name: t('components.signAndSubmit.form.selectAccount'), address: ''} as Account
    const [status, setStatus] = useState('')
    const [accounts, setAccounts] = useState<Account[]>([emptyAccount])
    const {apiState, keyringState, apiError, keyring} = useSubstrate();

    useEffect(() => {
        if (keyringState === 'READY' && keyring) {
            const keyringAccounts = keyring.getAccounts().map((account) => {
                return {name: account.meta?.name || '', address: account.address}
            })
            setAccounts([emptyAccount, ...keyringAccounts])
        }
    }, [keyring, keyringState])

    const contextRef = createRef<HTMLDivElement>();

    return (
        <div ref={contextRef}>
            {apiState === 'ERROR' ? <p>{apiError}</p> : null}
            {apiState !== 'READY' ? <p>Not connected</p> : null}
            {keyringState !== 'READY' ? <p>Loading accounts (please review any extension's authorization)</p> : null}
            {accounts.length === 0 || accounts.length === 1 ? <p>No accounts available</p> :
                <Formik
                    initialValues={{
                        account: accounts[0],
                    } as FormikState}
                    onSubmit={(values: FormikState) => {
                    }}>
                    {({
                          values,
                          handleSubmit
                      }) =>
                        <div className={classes.paper}>
                            <form className={classes.form} autoComplete="off" onSubmit={handleSubmit}>
                                <TypedSelect
                                    name="account"
                                    label={t('components.signAndSubmit.form.selectAccount')}
                                    options={accounts}
                                    value={values.account}
                                    renderOption={(value: Account) => {
                                        return value.name ?? value.address
                                    }}
                                />
                            </form>
                            <p>{status}</p>
                            <TxButton
                                label={t('components.signAndSubmit.form.signAndSubmit')}
                                address={values.account.address}
                                setStatus={(status: string) => setStatus(status)}
                                attrs={txAttrs}
                            />
                            <Button variant={"text"} color="primary" type="button">
                                {t('components.signAndSubmit.form.cancel')}
                            </Button>
                        </div>}
                </Formik>}
        </div>
    );
}

export default TxSignAndSubmitForm
