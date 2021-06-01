import { IdeaDto, IdeaNetworkDto, IdeaStatus } from '../ideas.dto'
import { AuthContextUser } from '../../auth/AuthContext'

export function doesIdeaBelongToUser(idea: IdeaDto, user?: AuthContextUser) {
    return idea.ownerId === user?.id
}

export function createEmptyIdea(network: string): IdeaDto {
    return {
        title: '',
        beneficiary: '',
        field: '',
        content: '',
        networks: [{ name: network, value: 0 } as IdeaNetworkDto],
        contact: '',
        portfolio: '',
        links: [''],
        status: IdeaStatus.Draft,
    } as IdeaDto
}
