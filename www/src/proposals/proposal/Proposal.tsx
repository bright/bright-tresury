import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { useEffect, useState } from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { breakpoints } from '../../theme/theme'
import { ProposalInfo } from './info/ProposalInfo'
import { ProposalContentType } from './ProposalContentTypeTabs'
import { ProposalMilestones } from './milestones/ProposalMilestones'
import ProposalDiscussion from './discussion/ProposalDiscussion'
import ProposalVoting from './voting/ProposalVoting'
import { ProposalHeader } from './ProposalHeader'
import { useParams } from 'react-router'
import { getProposal, ProposalDto } from '../proposals.api'
import config from '../../config'

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

    let { path } = useRouteMatch()

    let { proposalIndex } = useParams<{ proposalIndex: string }>()

    const [proposal, setProposal] = useState<ProposalDto | undefined>()

    useEffect(() => {
        if (proposalIndex !== undefined) {
            getProposal(proposalIndex, config.NETWORK_NAME)
                .then((res) => {
                    setProposal(res)
                })
                .catch(() => {
                    // TODO: Handle API call error
                })
        }
    }, [proposalIndex])

    return (
        <div className={classes.root}>
            {proposal ? <ProposalHeader proposal={proposal} /> : null}

            <div className={classes.content}>
                <Switch>
                    <Route exact={true} path={path}>
                        {proposal ? <ProposalInfo proposal={proposal} /> : null}
                    </Route>
                    <Route exact={true} path={`${path}/${ProposalContentType.Info}`}>
                        {proposal ? <ProposalInfo proposal={proposal} /> : null}
                    </Route>
                    <Route exact={true} path={`${path}/${ProposalContentType.Milestones}`}>
                        {proposal?.ideaId ? <ProposalMilestones ideaId={proposal.ideaId} /> : null}
                    </Route>
                    <Route exact={true} path={`${path}/${ProposalContentType.Discussion}`}>
                        <ProposalDiscussion />
                    </Route>
                    <Route exact={true} path={`${path}/${ProposalContentType.Voting}`}>
                        <ProposalVoting />
                    </Route>
                </Switch>
            </div>
        </div>
    )
}
