import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Strong from '../../../components/strong/Strong'
import SubmittingTransaction, {
    SubmittingTransactionProps,
} from '../../../substrate-lib/components/SubmittingTransaction'
import { TipCreateFormValues } from '../useTipCreate'

interface OwnProps {
    tip: TipCreateFormValues
}

export type TipCreateOnlySubmittingTransactionProps = OwnProps &
    Pick<SubmittingTransactionProps, 'onTransactionSigned' | 'onSuccess' | 'onClose'>

const TipCreateOnlySubmittingTransaction = ({ tip, ...props }: TipCreateOnlySubmittingTransactionProps) => {
    const { t } = useTranslation()

    return (
        <SubmittingTransaction
            {...props}
            title={t('tip.create.submitModal.withoutTipping.title')}
            instruction={
                <Trans
                    id="modal-description"
                    i18nKey="tip.create.submitModal.withoutTipping.warningMessage"
                    components={{
                        strong: <Strong color={'primary'} />,
                    }}
                />
            }
            txAttrs={{
                palletRpc: 'tips',
                callable: 'reportAwesome',
                eventMethod: 'NewTip',
                eventDescription: t('tip.create.submitModal.withoutTipping.eventDescription'),
                inputParams: [
                    {
                        name: 'reason',
                        value: tip.blockchainReason,
                    },
                    {
                        name: 'who',
                        value: tip.beneficiary,
                    },
                ],
            }}
        />
    )
}

export default TipCreateOnlySubmittingTransaction
