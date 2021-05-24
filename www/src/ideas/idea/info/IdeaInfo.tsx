import React from 'react'
import IdeaDetails from './IdeaDetails'
import { IdeaEdit } from './IdeaEdit'
import { IdeaDto } from '../../ideas.dto'
import { useIdeaStyles } from '../Idea'

interface Props {
    idea: IdeaDto
    canEdit: boolean
}

export const IdeaInfo = ({ idea, canEdit }: Props) => {
    const classes = useIdeaStyles()

    return <div className={classes.content}>{canEdit ? <IdeaEdit idea={idea} /> : <IdeaDetails idea={idea} />}</div>
}
