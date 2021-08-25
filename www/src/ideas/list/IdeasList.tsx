import React from 'react'
import IdeaCard from './IdeaCard'
import { IdeaDto } from '../ideas.dto'
import Grid from '../../components/grid/Grid'

interface OwnProps {
    ideas: IdeaDto[]
}

export type IdeasListProps = OwnProps

const IdeasList = ({ ideas }: IdeasListProps) => {
    const renderCard = (idea: IdeaDto) => <IdeaCard idea={idea} />

    return <Grid items={ideas.sort((a, b) => b.ordinalNumber - a.ordinalNumber)} renderItem={renderCard} />
}

export default IdeasList
