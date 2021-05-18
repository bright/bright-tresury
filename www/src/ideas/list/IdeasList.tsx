import React from 'react'
import { IdeaCard } from './IdeaCard'
import { IdeaDto } from '../ideas.api'
import { Grid } from '../../components/grid/Grid'

interface Props {
    ideas: IdeaDto[]
}

export const IdeasList = ({ ideas }: Props) => {
    const renderCard = (idea: IdeaDto) => <IdeaCard idea={idea} />

    return <Grid items={ideas} renderItem={renderCard} />
}
