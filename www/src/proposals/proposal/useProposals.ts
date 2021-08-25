import { useMemo } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { Nil } from '../../util/types'
import { ProposalDto, ProposalStatus } from '../proposals.dto'

export const useProposal = (proposal: Nil<ProposalDto>) => {
    const { isUserSignedInAndVerified, user } = useAuth()

    const isOwner = useMemo(() => {
        return isUserSignedInAndVerified && proposal?.ownerId === user?.id
    }, [isUserSignedInAndVerified, proposal, user])

    const isProposalEditable = useMemo(() => {
        return !!proposal && proposal.status === ProposalStatus.Submitted
    }, [proposal])

    const canEditProposal = useMemo(() => {
        return isOwner && isProposalEditable
    }, [isOwner, isProposalEditable])

    return {
        isOwner,
        isProposalEditable,
        canEditProposal,
    }
}
