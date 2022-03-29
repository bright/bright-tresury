import { useMemo } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { formatAddress } from '../../components/identicon/utils'
import { useNetworks } from '../../networks/useNetworks'
import { Nil } from '../../util/types'
import { ProposalDto } from '../proposals.dto'

interface UseProposalsResult {
    isOwner: boolean
    isProposer: boolean
    canEdit: boolean
    canEditMilestones: boolean
}

export const useProposal = (proposal: Nil<ProposalDto>): UseProposalsResult => {
    const { isUserSignedInAndVerified, user } = useAuth()
    const {
        network: { ss58Format },
    } = useNetworks()

    const isOwner = useMemo(() => {
        return isUserSignedInAndVerified && proposal?.owner?.userId === user?.id
    }, [isUserSignedInAndVerified, proposal, user])

    const isProposer = useMemo(() => {
        const encodedProposalAddress = formatAddress(proposal?.proposer.web3address, ss58Format, false)
        const isProposer = !!user?.web3Addresses?.find(
            ({ encodedAddress }) => encodedAddress === encodedProposalAddress,
        )
        return isUserSignedInAndVerified && isProposer
    }, [isUserSignedInAndVerified, proposal, user, ss58Format])

    const canEdit = useMemo(() => {
        return isOwner || isProposer
    }, [isOwner, isProposer])

    const canEditMilestones = useMemo(() => {
        return canEdit && !!proposal?.details
    }, [canEdit, proposal])

    return {
        isOwner,
        isProposer,
        canEdit,
        canEditMilestones,
    }
}
