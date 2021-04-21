import {apiGet, apiPatch, apiPost} from "../../../api";
import {Nil} from "../../../util/types";

export interface IdeaMilestoneDto {
    id: string,
    ordinalNumber: number
    subject: string,
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

export type CreateIdeaMilestoneDto = Omit<IdeaMilestoneDto, 'id' | 'ordinalNumber'>

export type PatchIdeaMilestoneDto = Partial<IdeaMilestoneDto>

export function getIdeaMilestones(ideaId: string) {
    return apiGet<IdeaMilestoneDto[]>(`/ideas/${ideaId}/milestones`)
}

export function createIdeaMilestone(ideaId: string, data: CreateIdeaMilestoneDto) {
    return apiPost<IdeaMilestoneDto>(`/ideas/${ideaId}/milestones`, data)
}

export function patchIdeaMilestone(ideaId: string, ideaMilestoneId: string, data: PatchIdeaMilestoneDto) {
    return apiPatch<IdeaMilestoneDto>(`/ideas/${ideaId}/milestones/${ideaMilestoneId}`, data)
}