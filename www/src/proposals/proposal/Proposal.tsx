import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { breakpoints } from '../../theme/theme'
import { ProposalInfo } from './info/ProposalInfo'
import { ProposalContentType } from './ProposalContentTypeTabs'
import { ProposalMilestones } from './milestones/ProposalMilestones'
import ProposalDiscussion from './discussion/ProposalDiscussion'
import ProposalVoting from './voting/ProposalVoting'
import { ProposalHeader } from './ProposalHeader'
import { useParams } from 'react-router'
import config from '../../config'
import { useGetProposal } from '../proposals.api'
import { UseQueryWrapper } from '../../components/loading/UseQueryWrapper'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            backgroundColor: theme.palette.background.paper,
        },
        content: {
            padding: '2.5em 5em 3em 3em',
            background: theme.palette.background.paper,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                padding: '2em 1.5em 3em 1.5em',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                padding: '1em 1.5em 4em 1em',
            },
        },
    }),
)

export const Proposal = () => {
    const classes = useStyles()

    const { t } = useTranslation()

    let { path } = useRouteMatch()

    let { proposalIndex } = useParams<{ proposalIndex: string }>()

    const { status, data: proposal } = useGetProposal(proposalIndex, config.NETWORK_NAME)

    return (
        <UseQueryWrapper status={status} error={t('errors.errorOccurredWhileLoadingProposal')}>
            {proposal ? (
                <div className={classes.root}>
                    <ProposalHeader proposal={proposal} />
                    <div className={classes.content}>
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
                                <ProposalVoting />
                            </Route>
                        </Switch>
                    </div>
                </div>
            ) : null}
        </UseQueryWrapper>
    )
}
