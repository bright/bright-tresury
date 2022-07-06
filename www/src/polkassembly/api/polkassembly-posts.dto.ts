import { ConfirmWeb3SignRequestDto, StartWeb3SignRequestDto } from '../../auth/handleWeb3Sign'
import { Network } from '../../networks/networks.dto'

export enum PolkassemblyPostType {
    Proposal = 'treasury_proposal',
    Bounty = 'bounty',
    Tip = 'tip',
    ChildBounty = 'child_bounty',
}

export interface PolkassemblyPostDto {
    title: string
    content: string
    onChainIndex: number | string
    type: PolkassemblyPostType
}

export interface PostMutationWeb3SignDetailsDto {
    network: Network
    postData: PolkassemblyPostDto
}

export type StartMutationRequestDto = StartWeb3SignRequestDto & {
    details: PostMutationWeb3SignDetailsDto
}

export type ConfirmMutationRequestDto = ConfirmWeb3SignRequestDto & {
    details: PostMutationWeb3SignDetailsDto
}
