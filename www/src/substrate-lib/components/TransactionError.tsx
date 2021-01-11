import {Box} from "@material-ui/core";
import React, {useMemo} from 'react';
import {useTranslation} from "react-i18next";
import failedImg from "../../assets/failed.svg"
import {Button} from "../../components/button/Button";

export interface Props {
    title: string
    subtitle?: string | JSX.Element
    error?: any
    onOk: () => void
}

const TransactionError: React.FC<Props> = ({error, onOk, title, subtitle}) => {
    const {t} = useTranslation()
    const errorCode = useMemo(() => error?.message?.substr(0, 4) ?? '', [error])
    return (
        <Box
            display="flex"
            flexDirection='column'
            alignItems='center'
        >
            <img src={failedImg} alt={title}/>
            <h2 id='modal-title'>{title}</h2>
            <p id='modal-description'>{subtitle ? subtitle : t([`substrate.error.transaction.subtitle.${errorCode}`, error?.message ?? 'substrate.error.transaction.subtitle.unspecific'])}</p>
            <Box pt='40px'>
                <Button color='primary' onClick={onOk}>{t('substrate.error.ok')}</Button>
            </Box>
        </Box>
    );
}

export default TransactionError
