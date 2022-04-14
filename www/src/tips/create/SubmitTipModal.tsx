import React, { useCallback } from 'react'
import { generatePath, useHistory } from 'react-router-dom'
import Modal from '../../components/modal/Modal'
import { useNetworks } from '../../networks/useNetworks'
import { ROUTE_TIP, ROUTE_TIPS } from '../../routes/routes'
import { ExtrinsicDetails } from '../../substrate-lib/components/SubmittingTransaction'
import { useCreateTip } from '../tips.api'
import { CreateTipDto } from '../tips.dto'
import TipCreateAndTipSubmittingTransaction from './create-and-tip/TipCreateAndTipSubmittingTransaction'
import TipCreateOnlySubmittingTransaction from './create-only/TipCreateOnlySubmittingTransaction'
import { TipCreateMode } from './TipCreateSwitch'
import { TipCreateFormValues } from './useTipCreate'

interface OwnProps {
    open: boolean
    onClose: () => void
    tip: TipCreateFormValues
    mode: TipCreateMode
}

export type SubmitTipModalProps = OwnProps

const SubmitTipModal = ({ open, onClose, tip, mode }: SubmitTipModalProps) => {
    const history = useHistory()

    const { mutateAsync } = useCreateTip()
    const { network } = useNetworks()

    const goToTips = (event?: any) => {
        const tipHash = event?.data?.toJSON()?.[0]
        tipHash !== undefined ? history.push(generatePath(ROUTE_TIP, { tipHash })) : history.push(ROUTE_TIPS)
    }

    const onTransactionSigned = useCallback(
        async ({ extrinsicHash, lastBlockHash, signerAddress }: ExtrinsicDetails) => {
            const params: CreateTipDto = {
                ...tip,
                networkId: network.id,
                finder: signerAddress,
                extrinsicHash,
                lastBlockHash,
            }
            await mutateAsync(params)
        },
        [tip, mutateAsync],
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
            {mode === 'createOnly' ? (
                <TipCreateOnlySubmittingTransaction
                    onClose={onClose}
                    onSuccess={goToTips}
                    onTransactionSigned={onTransactionSigned}
                    tip={tip}
                />
            ) : (
                <TipCreateAndTipSubmittingTransaction
                    onClose={onClose}
                    onSuccess={goToTips}
                    onTransactionSigned={onTransactionSigned}
                    tip={tip}
                />
            )}
        </Modal>
    )
}

export default SubmitTipModal
