import { AccountInfo } from '../../util/types'
import { ProposalDto } from '../proposals.dto'
import { AuthContextUser } from '../../auth/AuthContext'

const isProposalOwner = (ownerId?: string, user?: AuthContextUser) => ownerId && ownerId === user?.id
const isProposalProposer = (proposer: AccountInfo, user?: AuthContextUser) =>
    !!user?.web3Addresses.find((web3Address) => web3Address.address === proposer.address)

export const isProposalMadeByUser = (proposal: ProposalDto, user?: AuthContextUser): boolean =>
    isProposalOwner(proposal.ownerId, user) || isProposalProposer(proposal.proposer, user)
