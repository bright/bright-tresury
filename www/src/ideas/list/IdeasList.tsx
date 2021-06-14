import React from 'react'
import IdeaCard from './IdeaCard'
import { IdeaDto } from '../ideas.dto'
import Grid from '../../components/grid/Grid'

export interface IdeasListProps {
    ideas: IdeaDto[]
}

const IdeasList = ({ ideas }: IdeasListProps) => {
    const renderCard = (idea: IdeaDto) => <IdeaCard idea={idea} />

    return <Grid items={ideas} renderItem={renderCard} />
}

export default IdeasList
