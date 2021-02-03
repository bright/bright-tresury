import React from "react";
import IdeaCard from "./IdeaCard";
import {IdeaDto} from "../ideas.api";
import {Grid} from "../../components/grid/Grid";

interface Props {
    ideas: IdeaDto[]
}

const IdeasList: React.FC<Props> = ({ideas}) => {
    const renderCard = (idea: IdeaDto) => <IdeaCard idea={idea}/>
    return <Grid items={ideas} renderItem={renderCard}/>
}

export default IdeasList
