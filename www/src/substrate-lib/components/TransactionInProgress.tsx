import { Box } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import successImg from '../../assets/success.svg'
import Button from '../../components/button/Button'
import { Stepper } from '../../components/stepper/Stepper'
import { Status } from './SubmittingTransaction'
import TransactionModal from './TransactionModal'

interface OwnProps {
    status?: {
        isFinalized: boolean
        isInBlock: boolean
        isReady: boolean
    }
    event?: any
    onOk: (event?: any) => void
    eventDescription?: string
}

export type TransactionInProgressProps = OwnProps

enum Steps {
    READY,
    IN_BLOCK,
    EVENT,
    FINALIZED,
    FINISHED,
}

const TransactionInProgress = ({ status, onOk, event, eventDescription }: TransactionInProgressProps) => {
    const { t } = useTranslation()

    const [activeStep, setActiveStep] = useState(-1)

    useEffect(() => {
        console.log({
            '!status': !status,
            'status.isFinalized || status.isInBlock': status?.isFinalized || status?.isInBlock,
            event: !!event,
            'status.isInBlock': status?.isInBlock,
            'status.isReady': status?.isReady,
        })
        if (!status) {
            setActiveStep(Steps.READY)
        } else if (status.isFinalized || status.isInBlock) {
            setActiveStep(Steps.FINISHED)
        } else if (event) {
            setActiveStep(Steps.FINALIZED)
        } else if (status.isInBlock) {
            setActiveStep(Steps.EVENT)
        } else if (status.isReady) {
            setActiveStep(Steps.IN_BLOCK)
        }
    }, [status, event])

    const steps = [
        t('substrate.inProgress.steps.ready'),
        t('substrate.inProgress.steps.inBlock'),
        eventDescription !== undefined ? eventDescription : t('substrate.inProgress.steps.extrinsicSuccess'),
        t('substrate.inProgress.steps.finalized'),
    ]

    const success = activeStep >= steps.length
    console.log('TransactionInProgress: ', { status, event, eventDescription, activeStep })
    return (
        <TransactionModal
            title={t('substrate.inProgress.title')}
            imgSrc={success ? successImg : undefined}
            buttons={
                <Button
                    color="primary"
                    onClick={() => {
                        onOk(event)
                    }}
                    disabled={!success}
                >
                    {t('substrate.inProgress.ok')}
                </Button>
            }
        >
            <Box>
                <Stepper steps={steps} activeStep={activeStep}>
                    <></>
                </Stepper>
            </Box>
        </TransactionModal>
    )
}

export default TransactionInProgress
