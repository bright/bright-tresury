import { IdeaProposalDetailsDto } from '../idea-proposal-details/idea-proposal-details.dto'
import { AccountInfo, NetworkPlanckValue } from '../util/types'
import { PolkassemblyPostDto } from '../components/polkassemblyDescription/polkassembly-post.dto'
import { MotionDto } from '../components/voting/motion.dto'

export enum ProposalStatus {
    Submitted = 'submitted',
    Approved = 'approved',
    Rejected = 'rejected',
    Rewarded = 'rewarded',
    Closed = 'closed',
}

export interface ProposalDto {
    proposalIndex: number
    proposer: AccountInfo
    beneficiary: AccountInfo
    value: NetworkPlanckValue
    bond: NetworkPlanckValue
    status: ProposalStatus
    motions?: MotionDto[]
    isCreatedFromIdea: boolean
    isCreatedFromIdeaMilestone: boolean
    ideaId?: string
    ideaMilestoneId?: string
    ownerId?: string
    details?: IdeaProposalDetailsDto
    polkassembly?: PolkassemblyPostDto
}
