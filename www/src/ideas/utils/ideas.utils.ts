import { AuthContextUser } from '../../auth/AuthContext'

import { IdeaDto } from '../ideas.dto'

export function doesIdeaBelongToUser(idea: IdeaDto, user?: AuthContextUser) {
    return idea.owner.userId === user?.id
}
