import React, {useMemo} from 'react';
import ProposalsHeader from "./ProposalsHeader";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {LoadingWrapper, useLoading} from "../components/loading/LoadingWrapper";
import {getProposalsByNetwork} from "./proposals.api";
import config from "../config";
import {useLocation} from 'react-router-dom'
import ProposalsList from "./list/ProposalsList";
import {ProposalDefaultFilter, ProposalFilter, ProposalFilterSearchParamName} from "./list/ProposalStatusFilters";
import {filterProposals} from "./list/filterProposals";

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

    const {loadingState, response: proposals} = useLoading(getProposalsByNetwork(network), [network])

    const filter = useMemo(() => {
        const filterParam = new URLSearchParams(location.search).get(ProposalFilterSearchParamName)
        return filterParam ? filterParam as ProposalFilter : ProposalDefaultFilter
    }, [location.search])

    const filteredProposals = useMemo(() => {
        return proposals ? filterProposals(proposals, filter) : []
    }, [filter, proposals])

    return <div className={classes.root}>
        <ProposalsHeader filter={filter}/>
        <LoadingWrapper loadingState={loadingState}>
            <ProposalsList proposals={filteredProposals}/>
        </LoadingWrapper>
    </div>
}

export default Proposals
