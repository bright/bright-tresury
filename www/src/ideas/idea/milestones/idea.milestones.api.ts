import { apiGet, apiPatch, apiPost } from '../../../api'
import { Nil } from '../../../util/types'

export enum IdeaMilestoneStatus {
    Active = 'active',
    TurnedIntoProposal = 'turned_into_proposal',
}

export interface IdeaMilestoneDto {
    id: string
    ideaId: string
    ordinalNumber: number
    subject: string
    status: IdeaMilestoneStatus
    beneficiary: Nil<string>
    dateFrom: Nil<Date>
    dateTo: Nil<Date>
    description: Nil<string>
    networks: IdeaMilestoneNetworkDto[]
}

export interface IdeaMilestoneNetworkDto {
    id: string
    name: string
    value: number
}

export type CreateIdeaMilestoneDto = Omit<IdeaMilestoneDto, 'id' | 'ideaId' | 'ordinalNumber' | 'status'>

export type PatchIdeaMilestoneDto = Partial<IdeaMilestoneDto>

export interface TurnIdeaMilestoneIntoProposalDto {
    ideaMilestoneNetworkId: string
    extrinsicHash: string
    lastBlockHash: string
}

export function getIdeaMilestones(ideaId: string) {
    return apiGet<IdeaMilestoneDto[]>(`/ideas/${ideaId}/milestones`)
}

export function getIdeaMilestone(ideaMilestoneId: string) {
    const ideaMilestoneMock: IdeaMilestoneDto = {
        id: '928be15c-c4d3-4b62-a0e9-a79b811fd233',
        ordinalNumber: 44,
        subject: 'MILESTONE',
        status: IdeaMilestoneStatus.TurnedIntoProposal,
        beneficiary: '15Vn4KyqUhE1YtSNsZ8E6pAMSjbYVdz6MR4L2971Zs7ju9ZT',
        dateFrom: null,
        dateTo: null,
        description: `
            Nam eu massa eget dolor ullamcorper rutrum eget in mi. Praesent nulla mauris, facilisis viverra orci in, porta ultricies diam. Quisque pellentesque, enim et tempus placerat, metus nisl placerat lacus, at gravida orci ante vitae ex. Nullam volutpat dolor euismod nibh sagittis, ac lobortis nisl posuere. Nam et consectetur est. Nam et magna laoreet massa tempus tincidunt. Ut mollis nibh fringilla tortor eleifend fermentum. Vestibulum gravida et purus tincidunt aliquam. Nulla hendrerit magna et consequat ornare.
        `,
        networks: [
            {
                id: 'a7206875-97f5-4a37-8487-d77a6e508193',
                name: 'localhost',
                value: 200,
            } as IdeaMilestoneNetworkDto,
        ],
        ideaId: 'd6c48317-a062-4e0c-a52b-fa9b3843b26c',
    }

    return Promise.resolve(ideaMilestoneMock)
}

export function createIdeaMilestone(ideaId: string, data: CreateIdeaMilestoneDto) {
    return apiPost<IdeaMilestoneDto>(`/ideas/${ideaId}/milestones`, data)
}

export function patchIdeaMilestone(ideaId: string, ideaMilestoneId: string, data: PatchIdeaMilestoneDto) {
    return apiPatch<IdeaMilestoneDto>(`/ideas/${ideaId}/milestones/${ideaMilestoneId}`, data)
}

export function turnIdeaMilestoneIntoProposal(
    ideaId: string,
    ideaMilestoneId: string,
    data: TurnIdeaMilestoneIntoProposalDto,
) {
    return apiPost<IdeaMilestoneNetworkDto>(`/ideas/${ideaId}/milestones/${ideaMilestoneId}/proposals`, data)
}
