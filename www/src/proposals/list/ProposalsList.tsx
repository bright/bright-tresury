import React from "react";
import ProposalCard from "./ProposalCard";
import {ProposalDto} from "../proposals.api";
import {Grid} from "../../components/grid/Grid";

interface Props {
    proposals: ProposalDto[]
}

const ProposalList: React.FC<Props> = ({proposals}) => {
    const renderCard = (proposal: ProposalDto) => <ProposalCard proposal={proposal}/>
    return <Grid items={proposals} renderItem={renderCard}/>
}

export default ProposalList
