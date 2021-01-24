import React, {useEffect, useState} from 'react';
import ProposalsHeader from "./ProposalsHeader";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {LoadingState, LoadingWrapper} from "../components/loading/LoadingWrapper";
import {getProposalsByNetwork, ProposalDto} from "./proposals.api";
import config from "../config";
import ProposalList from "./list/ProposalsList";

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

    const [proposals, setProposals] = useState<ProposalDto[]>([])
    const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading)

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
        <ProposalsHeader/>
        <LoadingWrapper loadingState={loadingState}>
            <ProposalList proposals={proposals}/>
        </LoadingWrapper>
    </div>
}

export default Proposals
