import {Box} from "@material-ui/core";
import React from 'react';
import {useTranslation} from "react-i18next";
import cautionImg from "../../assets/caution.svg"
import {Button} from "../../components/button/Button";
import {ExtrinsicError} from "./SubmittingTransaction";

export interface Props {
    error: ExtrinsicError,
    onOk: () => void
}

const ExtrinsicFailed: React.FC<Props> = ({error, onOk}) => {
    const {t} = useTranslation()
    return (
        <Box
            display="flex"
            flexDirection='column'
            alignItems='center'
        >
        <img src={cautionImg} alt={t('substrate.extrinsicError.title')}/>
            <h2 id='modal-title'>{t('substrate.extrinsicError.title')}</h2>
            <p id='modal-description'>{t([`substrate.extrinsicError.subtitle.${error.section}.${error.name}`, error.description])}</p>
            <Box pt='40px'>
                <Button color='primary' onClick={onOk}>{t('substrate.extrinsicError.ok')}</Button>
            </Box>
        </Box>
    );
}

export default ExtrinsicFailed
