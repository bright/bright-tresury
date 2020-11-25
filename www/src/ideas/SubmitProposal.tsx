import { MenuItem } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import React, { useState } from 'react';
import { useSubstrate } from '../substrate-lib';
import { TxButton } from '../substrate-lib/components';
import {useTranslation} from "react-i18next";
import {Input} from "../components/input/Input";

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
    beneficiary: string
    value: number
}

const SubmitProposal: React.FC<Props> = ({ network = 'localhost', value = 100, beneficiary = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY' }) => {
    const classes = useStyles()
    const {t} = useTranslation()
    const { keyring, keyringState } = useSubstrate();

    const [address, setAddress] = useState('')
    const [status, setStatus] = useState('')

    const handleChangeAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(event.target.value)
    }


    const accounts = keyringState === 'READY' ? keyring.getAccounts() : []
    const account = keyringState === 'READY' && address ? keyring.getPair(address) : undefined
    return (
        <div className={classes.paper}>
            <form>
                <Input
                    id="network-select"
                    select
                    value={address}
                    onChange={handleChangeAddress}
                >
                    {accounts.map((account: KeyringAddress) => (
                        <MenuItem key={account.address} value={account.address}>
                            {account.meta.name}
                        </MenuItem>
                    ))}
                </Input>
            </form>
            <p>{status}</p>
            <TxButton
                label={t('idea.details.signAndSubmit')}
                type='SIGNED-TX'
                color='blue'
                accountPair={account}
                setStatus={setStatus}
                attrs={{
                    palletRpc: 'treasury',
                    callable: 'proposeSpend',
                    inputParams: [value.toString(), beneficiary],
                    paramFields: ['value', 'beneficiary']
                }}
            />
        </div >
    );
}

export default SubmitProposal
