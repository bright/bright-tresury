import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { Switch, useRouteMatch } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import LoadingWrapper from '../../components/loading/LoadingWrapper'
import { useSuccessfullyLoadedItemStyles } from '../../components/loading/useSuccessfullyLoadedItemStyles'
import { useNetworks } from '../../networks/useNetworks'
import PrivateRoute from '../../routes/PrivateRoute'
import Route from '../../routes/Route'
import { ROUTE_EDIT_PROPOSAL } from '../../routes/routes'
import { isProposalMadeByUser } from '../list/filterProposals'
import { useGetProposal } from '../proposals.api'
import ProposalDiscussion from './discussion/ProposalDiscussion'
import ProposalEdit from './edit/ProposalEdit'
import ProposalInfo from './info/ProposalInfo'
import ProposalMilestones from './milestones/ProposalMilestones'
import { ProposalContentType } from './ProposalContentTypeTabs'
import ProposalHeader from './ProposalHeader'
import ProposalVoting from './voting/ProposalVoting'

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
                    <Switch>
                        <PrivateRoute requireVerified={true} exact={true} path={ROUTE_EDIT_PROPOSAL}>
                            <ProposalEdit proposal={proposal} />
                        </PrivateRoute>
                        <>
                            <ProposalHeader proposal={proposal} />
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
                        </>
                    </Switch>
                </div>
            ) : null}
        </LoadingWrapper>
    )
}

export default Proposal
