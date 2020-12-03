import {Box} from "@material-ui/core";
import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import successImg from '../../assets/success.svg';
import {Button} from "../../components/button/Button";
import {Stepper} from "../../components/stepper/Stepper";
import {Status} from "./SubmittingTransaction";

export interface Props {
    status?: Status,
    event?: any,
    onOk: () => void,
    eventDescription?: string
}

const TransactionInProgress: React.FC<Props> = ({status, onOk, event, eventDescription}) => {
    const {t} = useTranslation()

    const [activeStep, setActiveStep] = useState(-1)

    useEffect(() => {
        if (!status) {
            setActiveStep(0)
        } else if (status.isFinalized) {
            setActiveStep(4)
        } else if (event) {
            setActiveStep(3)
        } else if (status.isInBlock) {
            setActiveStep(2)
        } else if (status.isReady) {
            setActiveStep(1)
        }
    }, [status, event])

    const steps = [
        t('substrate.inProgress.steps.ready'),
        t('substrate.inProgress.steps.inBlock'),
        eventDescription !== undefined ? eventDescription : t('substrate.inProgress.steps.extrinsicSuccess'),
        t('substrate.inProgress.steps.finalized'),
    ]

    const success = activeStep >= steps.length

    return (
        <>
            {success ? <img src={successImg} alt={t('substrate.inProgress.title')}/> : null}
            <h2 id='modal-title'>{t('substrate.inProgress.title')}</h2>
            <Box p={'32px'}>
                <Stepper steps={steps} activeStep={activeStep}><></>
                </Stepper>
            </Box>
            <Button color='primary' onClick={onOk} disabled={!success}>{t('substrate.inProgress.ok')}</Button>
        </>
    );
}

export default TransactionInProgress
