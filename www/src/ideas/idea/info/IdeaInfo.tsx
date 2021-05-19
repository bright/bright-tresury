import React from 'react'
import IdeaDetails from './IdeaDetails'
import { IdeaEdit } from './IdeaEdit'
import { IdeaDto } from '../../ideas.dto'

interface Props {
    idea: IdeaDto
    canEdit: boolean
}

export const IdeaInfo = ({ idea, canEdit }: Props) => {
    return <>{canEdit ? <IdeaEdit idea={idea} /> : <IdeaDetails idea={idea} />}</>
}
