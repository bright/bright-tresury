import {Box} from "@material-ui/core";
import React from 'react';
import {useTranslation} from "react-i18next";
import failedImg from "../../assets/failed.svg"
import {Button} from "../../components/button/Button";

export interface Props {
    error: any,
    onOk: () => void
}

const TransactionError: React.FC<Props> = ({error, onOk}) => {
    const {t} = useTranslation()
    return (
        <Box
            display="flex"
            flexDirection='column'
            alignItems='center'
        >

        <img src={failedImg} alt={t('substrate.error.title')}/>
            <h2 id='modal-title'>{t('substrate.error.title')}</h2>
            <p id='modal-description'>{t('substrate.error.subtitle')}</p>
            <Box pt='40px'>
                <Button color='primary' onClick={onOk}>{t('substrate.error.ok')}</Button>
            </Box>
        </Box>
    );
}

export default TransactionError
