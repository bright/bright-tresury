import { TipDto, TipStatus } from '../tips.dto'
import { useMemo } from 'react'
import { useAuth } from '../../auth/AuthContext'

export const useTip = (tip: TipDto) => {
    const { user, hasWeb3AddressAssigned } = useAuth()

    const { isProposed, isTipped, isClosing, isPendingPayout } = useMemo(
        () => ({
            isProposed: tip.status === TipStatus.Proposed,
            isTipped: tip.status === TipStatus.Tipped,
            isClosing: tip.status === TipStatus.Closing,
            isPendingPayout: tip.status === TipStatus.PendingPayout,
        }),
        [tip.status],
    )

    const isOwner = useMemo(() => user?.id && user?.id === tip?.owner?.userId, [user, tip])
    const isFinder = useMemo(() => hasWeb3AddressAssigned(tip.finder.web3address), [tip, hasWeb3AddressAssigned])
    const isBeneficiary = useMemo(() => hasWeb3AddressAssigned(tip.beneficiary.web3address), [
        tip,
        hasWeb3AddressAssigned,
    ])
    const canCloseTip = isPendingPayout
    const canCancelTip = useMemo(() => isFinder, [isFinder])

    return { isProposed, isTipped, isClosing, canCloseTip, canCancelTip, isOwner, isFinder, isBeneficiary }
}
