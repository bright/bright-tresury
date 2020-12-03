import {Box} from "@material-ui/core";
import React from 'react';
import {useTranslation} from "react-i18next";
import cautionImg from "../../assets/caution.svg"
import {Button} from "../../components/button/Button";

export interface Props {
    error: any,
    onOk: () => void
}

const TransactionWarning: React.FC<Props> = ({error, onOk}) => {
    const {t} = useTranslation()
    return (
        <>
            <img src={cautionImg} alt={t('substrate.warning.title')}/>
            <h2 id='modal-title'>{t('substrate.warning.title')}</h2>
            <p id='modal-description'>{t('substrate.warning.subtitle')}</p>
            <Box pt='40px'>
                <Button color='primary' onClick={onOk}>{t('substrate.warning.ok')}</Button>
            </Box>
        </>
    );
}

export default TransactionWarning
