import React from 'react'
import { useTranslation } from 'react-i18next'
import cautionImg from '../../assets/caution.svg'
import Button from '../../components/button/Button'
import { ExtrinsicError } from './SubmittingTransaction'
import TransactionModal from './TransactionModal'

interface OwnProps {
    error: ExtrinsicError
    onOk: () => void
}

export type ExtrinsicFailedProps = OwnProps

const ExtrinsicFailed = ({ error, onOk }: ExtrinsicFailedProps) => {
    const { t } = useTranslation()

    return (
        <TransactionModal
            title={t('substrate.extrinsicError.title')}
            subtitle={t([
                `substrate.extrinsicError.subtitle.${error.section}.${error.name}`,
                `substrate.extrinsicError.subtitle.general.${error.description}`,
                error.description,
            ])}
            imgSrc={cautionImg}
            buttons={
                <Button color="primary" onClick={onOk}>
                    {t('substrate.extrinsicError.ok')}
                </Button>
            }
        />
    )
}

export default ExtrinsicFailed
