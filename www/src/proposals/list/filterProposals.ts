import { ProposalDto } from '../proposals.dto'
import { AuthContextUser } from '../../auth/AuthContext'
import { PublicUserDto } from '../../util/publicUser.dto'
import { Nil } from '../../util/types'

const isProposalOwner = (ownerId?: Nil<string>, user?: AuthContextUser) => ownerId && ownerId === user?.id
const isProposalProposer = (proposer: PublicUserDto, user?: AuthContextUser) =>
    !!user?.web3Addresses.find((web3Address) => web3Address.address === proposer.web3address)

export const isProposalMadeByUser = (proposal: ProposalDto, user?: AuthContextUser): boolean =>
    isProposalOwner(proposal.owner?.userId, user) || isProposalProposer(proposal.proposer, user)
