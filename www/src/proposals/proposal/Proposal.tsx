import React from 'react'
import { Switch, useRouteMatch } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { useNetworks } from '../../networks/useNetworks'
import Route from '../../routes/Route'
import { isProposalMadeByUser } from '../list/filterProposals'
import ProposalInfo from './info/ProposalInfo'
import { ProposalContentType } from './ProposalContentTypeTabs'
import ProposalMilestones from './milestones/ProposalMilestones'
import ProposalDiscussion from './discussion/ProposalDiscussion'
import ProposalVoting from './voting/ProposalVoting'
import { useParams } from 'react-router'
import { useGetProposal } from '../proposals.api'
import LoadingWrapper from '../../components/loading/LoadingWrapper'
import { useTranslation } from 'react-i18next'
import { useSuccessfullyLoadedItemStyles } from '../../components/loading/useSuccessfullyLoadedItemStyles'
import ProposalHeader from './ProposalHeader'

const Proposal = () => {
    const classes = useSuccessfullyLoadedItemStyles()

    const { t } = useTranslation()

    let { path } = useRouteMatch()

    let { proposalIndex } = useParams<{ proposalIndex: string }>()
    const { network } = useNetworks()

    const { status, data: proposal } = useGetProposal(proposalIndex, network.id)

    const { user } = useAuth()

    const canEdit = proposal ? isProposalMadeByUser(proposal, user) : false

    return (
        <LoadingWrapper
            status={status}
            errorText={t('errors.errorOccurredWhileLoadingProposal')}
            loadingText={t('loading.proposal')}
        >
            {proposal ? (
                <div className={classes.root}>
                    <ProposalHeader searchParamName={ProposalContentType.Info} proposal={proposal} />
                    <Switch>
                        <Route exact={true} path={path}>
                            <ProposalInfo proposal={proposal} />
                        </Route>
                        <Route exact={true} path={`${path}/${ProposalContentType.Info}`}>
                            <ProposalInfo proposal={proposal} />
                        </Route>
                        <Route exact={true} path={`${path}/${ProposalContentType.Milestones}`}>
                            <ProposalMilestones proposal={proposal} canEdit={canEdit} />
                        </Route>
                        <Route exact={true} path={`${path}/${ProposalContentType.Discussion}`}>
                            <ProposalDiscussion proposalIndex={proposal.proposalIndex} />
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
