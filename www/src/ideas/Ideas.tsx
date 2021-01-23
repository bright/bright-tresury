import React, {useEffect, useMemo, useState} from 'react';
import {useLocation} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import {getIdeasByNetwork, IdeaDto} from './ideas.api';
import {DefaultFilter, FilterSearchParamName, IdeaFilter} from "./list/IdeaStatusFilters";
import config from '../config';
import {filterIdeas} from "./list/filterIdeas";
import IdeasHeader from "./IdeasHeader";
import IdeasList from "./IdeasList";

export const ideasHorizontalMargin = '32px'
export const ideasMobileHorizontalMargin = '18px'

interface Props {
    network: string
}

const Ideas: React.FC<Props> = ({network = config.NETWORK_NAME}) => {
    const location = useLocation()

    const [ideas, setIdeas] = useState<IdeaDto[]>([])
    const [status, setStatus] = useState<string>('')

    const filter = useMemo(() => {
        const filterParam = new URLSearchParams(location.search).get(FilterSearchParamName)
        return filterParam ? filterParam as IdeaFilter : DefaultFilter
    }, [location.search])

    const filteredIdeas = useMemo(() => {
        return filterIdeas(ideas, filter)
    }, [filter, ideas])

    useEffect(() => {
        setStatus('loading')
        getIdeasByNetwork(network)
            .then((response: IdeaDto[]) => {
                setIdeas(response)
                setStatus('resolved')
            })
            .catch(() => {
                setStatus('error')
            })
    }, [network])


    return (
        <div>
            <IdeasHeader/>
            {status === 'loading' && <p>Loading</p>}
            {status === 'error' && <p>Error</p>}
            {status === 'resolved' && (<IdeasList ideas={filteredIdeas}/>)}
        </div>
    );
}

export default Ideas
