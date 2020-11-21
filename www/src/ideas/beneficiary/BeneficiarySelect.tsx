import {Select} from "../../components/select/Select";
import {useSubstrate} from "../../substrate-lib";
import React, {PropsWithChildren, useState} from "react";
import {useTranslation} from "react-i18next";
import {KeyringAddress} from "@polkadot/ui-keyring/types";

export const BeneficiarySelect: React.FC<PropsWithChildren<any>> = (props) => {
    const {t} = useTranslation();
    const {keyring, keyringState} = useSubstrate();
    const [address, setAddress] = useState('')

    const accounts: KeyringAddress[] = keyringState === 'READY' ? keyring.getAccounts() : []
    const account = keyringState === 'READY' && address ? keyring.getPair(address) : undefined

    return <Select
        {...props}
        values={accounts}
        nameResolver={(account: KeyringAddress) => account.meta.name}
        label={t('idea.details.form.beneficiary')}
    />
}
