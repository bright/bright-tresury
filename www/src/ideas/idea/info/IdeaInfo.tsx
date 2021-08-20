import React from 'react'
import { useIdea } from '../useIdea'
import IdeaDetails from './IdeaDetails'
import IdeaEdit from './IdeaEdit'
import { IdeaDto } from '../../ideas.dto'
import { useSuccessfullyLoadedItemStyles } from '../../../components/loading/useSuccessfullyLoadedItemStyles'

interface OwnProps {
    idea: IdeaDto
}

export type IdeaInfoProps = OwnProps

const IdeaInfo = ({ idea }: IdeaInfoProps) => {
    const classes = useSuccessfullyLoadedItemStyles()
    const { canEditIdea } = useIdea(idea)

    return <div className={classes.content}>{canEditIdea ? <IdeaEdit idea={idea} /> : <IdeaDetails idea={idea} />}</div>
}
export default IdeaInfo
