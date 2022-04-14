import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Strong from '../../../components/strong/Strong'
import { useNetworks } from '../../../networks/useNetworks'
import SubmittingTransaction, {
    SubmittingTransactionProps,
} from '../../../substrate-lib/components/SubmittingTransaction'
import { toNetworkPlanckValue } from '../../../util/quota.util'
import { TipCreateFormValues } from '../useTipCreate'

interface OwnProps {
    tip: TipCreateFormValues
}

export type TipCreateAndTipSubmittingTransactionProps = OwnProps &
    Pick<SubmittingTransactionProps, 'onTransactionSigned' | 'onSuccess' | 'onClose'>

const TipCreateAndTipSubmittingTransaction = ({ tip, ...props }: TipCreateAndTipSubmittingTransactionProps) => {
    const { t } = useTranslation()
    const { network } = useNetworks()

    return (
        <SubmittingTransaction
            {...props}
            title={t('tip.create.submitModal.withTipping.title')}
            instruction={
                <Trans
                    id="modal-description"
                    i18nKey="tip.create.submitModal.withTipping.warningMessage"
                    components={{
                        strong: <Strong color={'primary'} />,
                    }}
                />
            }
            txAttrs={{
                palletRpc: 'tips',
                callable: 'tipNew',
                eventMethod: 'NewTip',
                eventDescription: t('tip.create.submitModal.withTipping.eventDescription'),
                inputParams: [
                    {
                        name: 'reason',
                        value: tip.blockchainReason,
                    },
                    {
                        name: 'who',
                        value: tip.beneficiary,
                    },
                    {
                        name: 'tipValue',
                        value: toNetworkPlanckValue(tip.value, network.decimals)!,
                        type: 'Compact<Balance>',
                    },
                ],
            }}
        />
    )
}

export default TipCreateAndTipSubmittingTransaction
