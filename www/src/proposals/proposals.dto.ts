import { IdeaProposalDetailsDto } from '../idea-proposal-details/idea-proposal-details.dto'
import { NetworkPlanckValue, Nil } from '../util/types'
import { PolkassemblyPostDto } from '../components/polkassemblyDescription/polkassembly-post.dto'
import { MotionDto } from '../components/voting/motion.dto'
import { PublicUserDto } from '../util/publicUser.dto'

export enum ProposalStatus {
    Submitted = 'submitted',
    Approved = 'approved',
    Rejected = 'rejected',
    Rewarded = 'rewarded',
    Closed = 'closed',
    Unknown = 'unknown',
}

export interface ProposalDto {
    proposalIndex: number
    proposer: PublicUserDto
    beneficiary: PublicUserDto
    value: NetworkPlanckValue
    bond: NetworkPlanckValue
    status: ProposalStatus
    motions?: MotionDto[]
    isCreatedFromIdea: boolean
    isCreatedFromIdeaMilestone: boolean
    ideaId?: string
    ideaMilestoneId?: string
    owner?: Nil<PublicUserDto>
    details?: IdeaProposalDetailsDto
    polkassembly?: PolkassemblyPostDto
}
