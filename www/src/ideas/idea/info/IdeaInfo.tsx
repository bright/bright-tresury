import React from 'react'
import IdeaDetails from './IdeaDetails'
import { IdeaEdit } from './IdeaEdit'
import { IdeaDto } from '../../ideas.dto'
import { useSuccessfullyLoadedItemStyles } from '../../../components/loading/useSuccessfullyLoadedItemStyles'

interface Props {
    idea: IdeaDto
    canEdit: boolean
}

export const IdeaInfo = ({ idea, canEdit }: Props) => {
    const classes = useSuccessfullyLoadedItemStyles()

    return <div className={classes.content}>{canEdit ? <IdeaEdit idea={idea} /> : <IdeaDetails idea={idea} />}</div>
}
