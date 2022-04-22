import { TipDto, TipStatus } from '../tips.dto'
import { useMemo } from 'react'
import { useAuth } from '../../auth/AuthContext'

export const useTip = (tip: TipDto) => {
    const { user, hasWeb3AddressAssigned } = useAuth()
    const isOwner = useMemo(() => user?.id && user?.id === tip?.owner?.userId, [user, tip])
    const isFinder = useMemo(() => hasWeb3AddressAssigned(tip.finder.web3address), [tip, hasWeb3AddressAssigned])
    const isBeneficiary = useMemo(() => hasWeb3AddressAssigned(tip.beneficiary.web3address), [
        tip,
        hasWeb3AddressAssigned,
    ])
    const canCloseTip = useMemo(() => tip.status === TipStatus.PendingPayout, [tip])
    const canCancelTip = useMemo(() => isFinder, [isFinder])

    return { canCloseTip, canCancelTip, isOwner, isFinder, isBeneficiary }
}
