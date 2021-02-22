import React, {useEffect, useMemo} from 'react';
import {useLocation} from 'react-router-dom';
import {getIdeasByNetwork} from './ideas.api';
import {IdeaDefaultFilter, IdeaFilter, IdeaFilterSearchParamName} from "./list/IdeaStatusFilters";
import config from '../config';
import {filterIdeas} from "./list/filterIdeas";
import IdeasHeader from "./IdeasHeader";
import IdeasList from "./list/IdeasList";
import {LoadingWrapper, useLoading} from "../components/loading/LoadingWrapper";

interface Props {
    network: string
}

const Ideas: React.FC<Props> = ({network = config.NETWORK_NAME}) => {
    const location = useLocation()

    const {loadingState, response: ideas, call} = useLoading(getIdeasByNetwork)

    useEffect(() => {
        call(network)
    }, [network, call])

    const filter = useMemo(() => {
        const filterParam = new URLSearchParams(location.search).get(IdeaFilterSearchParamName)
        return filterParam ? filterParam as IdeaFilter : IdeaDefaultFilter
    }, [location.search])

    const filteredIdeas = useMemo(() => {
        return ideas ? filterIdeas(ideas, filter) : []
    }, [filter, ideas])

    return <div>
        <IdeasHeader filter={filter}/>
        <LoadingWrapper loadingState={loadingState}>
            <IdeasList ideas={filteredIdeas}/>
        </LoadingWrapper>
    </div>
}

export default Ideas
