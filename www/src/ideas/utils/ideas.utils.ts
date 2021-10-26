import { AuthContextUser } from '../../auth/AuthContext'
import { IdeaFormValues } from '../form/IdeaForm'
import { IdeaDto } from '../ideas.dto'

export function doesIdeaBelongToUser(idea: IdeaDto, user?: AuthContextUser) {
    return idea.ownerId === user?.id
}

export function createEmptyIdea(network: string): IdeaFormValues {
    return {
        beneficiary: '',
        currentNetwork: { name: network, value: 0 },
        additionalNetworks: [],
        title: '',
        field: '',
        content: '',
        portfolio: '',
        links: [''],
        contact: '',
    }
}
