import React from 'react'
import { Switch, useRouteMatch } from 'react-router-dom'
import { useNetworks } from '../../networks/useNetworks'
import Route from '../../routes/Route'
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
import { ProposalDto } from '../proposals.dto'
import infoIcon from '../../assets/info.svg'
import milestonesIcon from '../../assets/milestones.svg'
import discussionIcon from '../../assets/discussion.svg'
import votingIcon from '../../assets/voting.svg'
import { Nil } from '../../util/types'
import ProposalEdit from './edit/ProposalEdit'
import PrivateRoute from '../../routes/PrivateRoute'
import { ROUTE_EDIT_PROPOSAL } from '../../routes/routes'
import TwitterShare from '../../components/twitterShare/TwitterShare'
import CornerFloater from '../../components/cornerFloater/CornerFloater'

export interface ProposalTabConfig {
    proposalContentType: ProposalContentType
    translationKey: string
    svg: string
    getUrl: (baseUrl: string) => string
    getRoute: (basePath: string, proposal: ProposalDto) => JSX.Element
    isDefault?: boolean
    notificationsCount?: Nil<number>
}

const PROPOSAL_CONTENT_TYPE_BUILDER: { [key in ProposalContentType]: ProposalTabConfig } = {
    [ProposalContentType.Info]: {
        proposalContentType: ProposalContentType.Info,
        translationKey: 'proposal.content.infoLabel',
        svg: infoIcon,
        getUrl: (baseUrl: string) => `${baseUrl}/${ProposalContentType.Info}`,
        getRoute: (basePath: string, proposal: ProposalDto) => (
            <Route key={ProposalContentType.Info} exact={true} path={`${basePath}/${ProposalContentType.Info}`}>
                <ProposalInfo proposal={proposal} />
            </Route>
        ),
        isDefault: true,
    },
    [ProposalContentType.Milestones]: {
        proposalContentType: ProposalContentType.Milestones,
        translationKey: 'proposal.content.milestonesLabel',
        svg: milestonesIcon,
        getUrl: (baseUrl: string) => `${baseUrl}/${ProposalContentType.Milestones}`,
        getRoute: (basePath: string, proposal: ProposalDto) => (
            <Route
                key={ProposalContentType.Milestones}
                exact={true}
                path={`${basePath}/${ProposalContentType.Milestones}`}
            >
                <ProposalMilestones proposal={proposal} />
            </Route>
        ),
    },
    [ProposalContentType.Discussion]: {
        proposalContentType: ProposalContentType.Discussion,
        translationKey: 'proposal.content.discussionLabel',
        svg: discussionIcon,
        getUrl: (baseUrl: string) => `${baseUrl}/${ProposalContentType.Discussion}`,
        getRoute: (basePath: string, proposal: ProposalDto) => (
            <Route
                key={ProposalContentType.Discussion}
                exact={true}
                path={`${basePath}/${ProposalContentType.Discussion}`}
            >
                <ProposalDiscussion proposal={proposal} />
            </Route>
        ),
    },
    [ProposalContentType.Voting]: {
        proposalContentType: ProposalContentType.Voting,
        translationKey: 'proposal.content.votingLabel',
        svg: votingIcon,
        getUrl: (baseUrl: string) => `${baseUrl}/${ProposalContentType.Voting}`,
        getRoute: (basePath: string, proposal: ProposalDto) => (
            <Route key={ProposalContentType.Voting} exact={true} path={`${basePath}/${ProposalContentType.Voting}`}>
                <ProposalVoting proposal={proposal} />
            </Route>
        ),
    },
}

const Proposal = () => {
    const classes = useSuccessfullyLoadedItemStyles()

    const { t } = useTranslation()

    let { path } = useRouteMatch()

    let { proposalIndex } = useParams<{ proposalIndex: string }>()
    const { network } = useNetworks()

    const { status, data: proposal } = useGetProposal(proposalIndex, network.id)

    const proposalContentTypes = [
        ProposalContentType.Info,
        ProposalContentType.Milestones,
        ProposalContentType.Discussion,
        ProposalContentType.Voting,
    ]

    const proposalTabsConfig = proposalContentTypes.map(
        (proposalContentType) => PROPOSAL_CONTENT_TYPE_BUILDER[proposalContentType],
    )

    const routes = proposal && proposalTabsConfig.map(({ getRoute }) => getRoute(path, proposal))

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
                            <ProposalHeader proposal={proposal} proposalTabsConfig={proposalTabsConfig} />
                            <Switch>
                                <Route exact={true} path={path}>
                                    <ProposalInfo proposal={proposal} />
                                </Route>
                                {routes}
                            </Switch>
                        </>
                    </Switch>
                    <CornerFloater>
                        <TwitterShare title={t('share.twitter.proposal')} />
                    </CornerFloater>
                </div>
            ) : null}
        </LoadingWrapper>
    )
}

export default Proposal
