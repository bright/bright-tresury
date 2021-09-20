import { useMemo } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { formatAddress } from '../../components/identicon/utils'
import { useNetworks } from '../../networks/useNetworks'
import { Nil } from '../../util/types'
import { ProposalDto, ProposalStatus } from '../proposals.dto'

export const useProposal = (proposal: Nil<ProposalDto>) => {
    const { isUserSignedInAndVerified, user } = useAuth()
    const {
        network: { ss58Format },
    } = useNetworks()

    const isOwner = useMemo(() => {
        return isUserSignedInAndVerified && proposal?.ownerId === user?.id
    }, [isUserSignedInAndVerified, proposal, user])

    const isProposer = useMemo(() => {
        const encodedProposalAddress = formatAddress(proposal?.proposer.address, ss58Format, false)
        const isProposer = !!user?.web3Addresses?.find(
            ({ encodedAddress }) => encodedAddress === encodedProposalAddress,
        )
        return isUserSignedInAndVerified && isProposer
    }, [isUserSignedInAndVerified, proposal, user, ss58Format])

    const isEditable = useMemo(() => {
        return !!proposal && proposal.status === ProposalStatus.Submitted
    }, [proposal])

    const canEdit = useMemo(() => {
        return (isOwner || isProposer) && isEditable
    }, [isOwner, isProposer, isEditable])

    const canEditMilestones = useMemo(() => {
        return canEdit && !!proposal?.details
    }, [canEdit, proposal])

    return {
        isOwner,
        isProposer,
        isEditable,
        canEdit,
        canEditMilestones,
    }
}
