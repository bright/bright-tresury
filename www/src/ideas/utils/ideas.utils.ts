import { IdeaDto, IdeaNetworkDto, IdeaStatus } from '../ideas.dto'
import { AuthContextUser } from '../../auth/AuthContext'

export function doesIdeaBelongToUser(idea: IdeaDto, user?: AuthContextUser) {
    return idea.ownerId === user?.id
}

export function createEmptyIdea(network: string): IdeaDto {
    return {
        beneficiary: '',
        networks: [{ name: network, value: 0 } as IdeaNetworkDto],
        status: IdeaStatus.Draft,
        details: {
            title: '',
            field: '',
            content: '',
            portfolio: '',
            links: [''],
            contact: '',
        },
    } as IdeaDto
}
