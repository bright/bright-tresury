import {apiGet, apiPatch, apiPost} from "../../../api";
import {Nil} from "../../../util/types";
import {ExtrinsicDetails} from "../../SubmitProposalModal";
import {IdeaDto, IdeaNetworkDto} from "../../ideas.api";

export enum IdeaMilestoneStatus {
    Active = 'active',
    TurnedIntoProposal = 'turned_into_proposal',
}

export interface IdeaMilestoneDto {
    id: string,
    ordinalNumber: number
    subject: string,
    status: IdeaMilestoneStatus,
    dateFrom: Nil<Date>,
    dateTo: Nil<Date>,
    description: Nil<string>,
    networks: IdeaMilestoneNetworkDto[]
}

export interface IdeaMilestoneNetworkDto {
    id: string
    name: string,
    value: number
}

export type CreateIdeaMilestoneDto = Omit<IdeaMilestoneDto, 'id' | 'ordinalNumber' | 'status'>

export type PatchIdeaMilestoneDto = Partial<IdeaMilestoneDto>

export interface ConvertIdeaMilestoneToProposalDto {
    ideaMilestoneNetworkId: string
    extrinsicHash: string
    lastBlockHash: string
}

export function getIdeaMilestones(ideaId: string) {
    return apiGet<IdeaMilestoneDto[]>(`/ideas/${ideaId}/milestones`)
}

export function createIdeaMilestone(ideaId: string, data: CreateIdeaMilestoneDto) {
    return apiPost<IdeaMilestoneDto>(`/ideas/${ideaId}/milestones`, data)
}

export function patchIdeaMilestone(ideaId: string, ideaMilestoneId: string, data: PatchIdeaMilestoneDto) {
    return apiPatch<IdeaMilestoneDto>(`/ideas/${ideaId}/milestones/${ideaMilestoneId}`, data)
}

export function convertIdeaMilestoneToProposal(
    ideaId: string,
    ideaMilestoneId: string,
    ideaMilestoneNetworkId: string,
    data: ConvertIdeaMilestoneToProposalDto
) {
    return apiPost<IdeaMilestoneDto>(`/ideas/${ideaId}/milestones/${ideaMilestoneId}/proposals`, data)
}