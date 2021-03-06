import React from 'react'
import IdeaDetails from './IdeaDetails'
import IdeaEdit from './IdeaEdit'
import { IdeaDto } from '../../ideas.dto'
import { useSuccessfullyLoadedItemStyles } from '../../../components/loading/useSuccessfullyLoadedItemStyles'

export interface IdeaInfoProps {
    idea: IdeaDto
    canEdit: boolean
}

const IdeaInfo = ({ idea, canEdit }: IdeaInfoProps) => {
    const classes = useSuccessfullyLoadedItemStyles()

    return <div className={classes.content}>{canEdit ? <IdeaEdit idea={idea} /> : <IdeaDetails idea={idea} />}</div>
}
export default IdeaInfo
