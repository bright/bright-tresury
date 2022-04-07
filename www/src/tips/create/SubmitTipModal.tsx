import React, { useCallback } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { generatePath, useHistory } from 'react-router-dom'
import Modal from '../../components/modal/Modal'
import Strong from '../../components/strong/Strong'
import { useNetworks } from '../../networks/useNetworks'
import { ROUTE_TIP, ROUTE_TIPS } from '../../routes/routes'
// import { ROUTE_BOUNTIES, ROUTE_TIP } from '../../routes/routes'
import SubmittingTransaction, { ExtrinsicDetails } from '../../substrate-lib/components/SubmittingTransaction'
import { toNetworkPlanckValue } from '../../util/quota.util'
import { TipCreateFormValues } from './useTipCreate'
// import { useCreateTip } from '../bounties.api'
// import { CreateTipDto } from '../bounties.dto'

interface OwnProps {
    open: boolean
    onClose: () => void
    tip: TipCreateFormValues
}

export type SubmitTipModalProps = OwnProps

const SubmitTipModal = ({ open, onClose, tip }: SubmitTipModalProps) => {
    const { t } = useTranslation()

    const history = useHistory()

    // const { mutateAsync } = useCreateTip()
    const { network } = useNetworks()

    const goToTips = (event?: any) => {
        const tipHash = event?.data?.toJSON()?.[0]
        tipHash !== undefined ? history.push(generatePath(ROUTE_TIP, { tipHash })) : history.push(ROUTE_TIPS)
    }

    const onTransactionSigned = useCallback(
        async ({ extrinsicHash, lastBlockHash, signerAddress }: ExtrinsicDetails) => {
            // todo call backend
            console.log('transaction signed')
            // if (tip) {
            //     const params: CreateTipDto = {
            //         ...tip,
            //         networkId: network.id,
            //         proposer: signerAddress,
            //         extrinsicHash,
            //         lastBlockHash,
            //         value: toNetworkPlanckValue(tip.value, network.decimals)!,
            //     }
            //     await mutateAsync(params)
            // }
        },
        [
            tip,
            //    mutateAsync
        ],
    )

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            fullWidth={true}
            maxWidth={'sm'}
        >
            <SubmittingTransaction
                title={t('tip.create.submitModal.title')}
                instruction={
                    <Trans
                        id="modal-description"
                        i18nKey="tip.create.submitModal.warningMessage"
                        components={{
                            strong: <Strong color={'primary'} />,
                        }}
                    />
                }
                onSuccess={goToTips}
                onClose={onClose}
                txAttrs={{
                    palletRpc: 'tips',
                    callable: 'reportAwesome',
                    eventMethod: 'NewTip',
                    eventDescription: t('tip.create.submitModal.eventDescription'),
                    inputParams: [
                        {
                            name: 'reason',
                            value: tip.blockchainDescription,
                        },
                        {
                            name: 'who',
                            value: tip.beneficiary,
                        },
                    ],
                }}
                onTransactionSigned={onTransactionSigned}
            />
        </Modal>
    )
}

export default SubmitTipModal
