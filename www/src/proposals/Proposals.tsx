import React, {useEffect, useMemo, useState} from 'react';
import ProposalsHeader from "./ProposalsHeader";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {LoadingState, LoadingWrapper} from "../components/loading/LoadingWrapper";
import {getProposalsByNetwork, ProposalDto} from "./proposals.api";
import config from "../config";
import {useLocation} from 'react-router-dom'
import ProposalList from "./list/ProposalsList";
import {ProposalDefaultFilter, ProposalFilter, ProposalFilterSearchParamName} from "./list/ProposalStatusFilters";

export const proposalsHorizontalMargin = '32px'
export const proposalsMobileHorizontalMargin = '18px'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%'
        }
    }))

interface Props {
    network: string
}

const Proposals: React.FC<Props> = ({network = config.NETWORK_NAME}) => {
    const classes = useStyles()
    const location = useLocation()

    const [proposals, setProposals] = useState<ProposalDto[]>([])
    const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading)

    const filter = useMemo(() => {
        const filterParam = new URLSearchParams(location.search).get(ProposalFilterSearchParamName)
        return filterParam ? filterParam as ProposalFilter : ProposalDefaultFilter
    }, [location.search])

    const filteredProposals = useMemo(() => {
        // TODO: filter proposals
        return proposals
    }, [filter, proposals])

    useEffect(() => {
        getProposalsByNetwork(network)
            .then((response) => {
                setProposals(response)
                setLoadingState(LoadingState.Resolved)
            })
            .catch(() => {
                setLoadingState(LoadingState.Error)
            })
    }, [network])

    return <div className={classes.root}>
        <ProposalsHeader filter={filter}/>
        <LoadingWrapper loadingState={loadingState}>
            <ProposalList proposals={filteredProposals}/>
        </LoadingWrapper>
    </div>
}

export default Proposals
