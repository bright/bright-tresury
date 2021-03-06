import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import ProposalInfo from './info/ProposalInfo'
import { ProposalContentType } from './ProposalContentTypeTabs'
import { ProposalMilestones } from './milestones/ProposalMilestones'
import ProposalDiscussion from './discussion/ProposalDiscussion'
import ProposalVoting from './voting/ProposalVoting'
import { useParams } from 'react-router'
import config from '../../config'
import { useGetProposal } from '../proposals.api'
import { LoadingWrapper } from '../../components/loading/LoadingWrapper'
import { useTranslation } from 'react-i18next'
import { useSuccessfullyLoadedItemStyles } from '../../components/loading/useSuccessfullyLoadedItemStyles'
import ProposalHeader from './ProposalHeader'

const Proposal = () => {
    const classes = useSuccessfullyLoadedItemStyles()

    const { t } = useTranslation()

    let { path } = useRouteMatch()

    let { proposalIndex } = useParams<{ proposalIndex: string }>()

    const { status, data: proposal } = useGetProposal(proposalIndex, config.NETWORK_NAME)

    return (
        <LoadingWrapper
            status={status}
            errorText={t('errors.errorOccurredWhileLoadingProposal')}
            loadingText={t('loading.proposal')}
        >
            {proposal ? (
                <div className={classes.root}>
                    <ProposalHeader proposal={proposal} />
                    <Switch>
                        <Route exact={true} path={path}>
                            <ProposalInfo proposal={proposal} />
                        </Route>
                        <Route exact={true} path={`${path}/${ProposalContentType.Info}`}>
                            <ProposalInfo proposal={proposal} />
                        </Route>
                        {proposal.isCreatedFromIdea && proposal.ideaId ? (
                            <Route exact={true} path={`${path}/${ProposalContentType.Milestones}`}>
                                <ProposalMilestones ideaId={proposal.ideaId} />
                            </Route>
                        ) : null}
                        <Route exact={true} path={`${path}/${ProposalContentType.Discussion}`}>
                            <ProposalDiscussion />
                        </Route>
                        <Route exact={true} path={`${path}/${ProposalContentType.Voting}`}>
                            {proposal ? <ProposalVoting proposal={proposal} /> : null}
                        </Route>
                    </Switch>
                </div>
            ) : null}
        </LoadingWrapper>
    )
}

export default Proposal
