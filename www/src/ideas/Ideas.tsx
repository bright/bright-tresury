import React, {useEffect, useMemo, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {getIdeasByNetwork, IdeaDto} from './ideas.api';
import {IdeaDefaultFilter, IdeaFilter, IdeaFilterSearchParamName} from "./list/IdeaStatusFilters";
import config from '../config';
import {filterIdeas} from "./list/filterIdeas";
import IdeasHeader from "./IdeasHeader";
import IdeasList from "./list/IdeasList";
import {LoadingState, LoadingWrapper} from "../components/loading/LoadingWrapper";

export const ideasHorizontalMargin = '32px'
export const ideasMobileHorizontalMargin = '18px'

interface Props {
    network: string
}

const Ideas: React.FC<Props> = ({network = config.NETWORK_NAME}) => {
    const location = useLocation()

    const [ideas, setIdeas] = useState<IdeaDto[]>([])
    const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading)

    const filter = useMemo(() => {
        const filterParam = new URLSearchParams(location.search).get(IdeaFilterSearchParamName)
        return filterParam ? filterParam as IdeaFilter : IdeaDefaultFilter
    }, [location.search])

    const filteredIdeas = useMemo(() => {
        return filterIdeas(ideas, filter)
    }, [filter, ideas])

    useEffect(() => {
        getIdeasByNetwork(network)
            .then((response: IdeaDto[]) => {
                setIdeas(response)
                setLoadingState(LoadingState.Resolved)
            })
            .catch(() => {
                setLoadingState(LoadingState.Error)
            })
    }, [network])

    return <div>
        <IdeasHeader filter={filter}/>
        <LoadingWrapper loadingState={loadingState}>
            <IdeasList ideas={filteredIdeas}/>
        </LoadingWrapper>
    </div>
}

export default Ideas
