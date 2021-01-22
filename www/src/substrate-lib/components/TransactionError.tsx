import React, {useMemo} from 'react';
import {useTranslation} from "react-i18next";
import failedImg from "../../assets/failed.svg";
import {Button} from "../../components/button/Button";
import TransactionModal from "./TransactionModal";

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
        <TransactionModal
            imgSrc={failedImg}
            title={title}
            subtitle={subtitle || t([`substrate.error.transaction.subtitle.${errorCode}`, error?.message ?? 'substrate.error.transaction.subtitle.unspecific'])}
            buttons={<Button color='primary' onClick={onOk}>{t('substrate.error.ok')}</Button>}
        />
    );
}

export default TransactionError
