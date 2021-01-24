import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import React from 'react';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import {breakpoints} from "../../theme/theme";
import ProposalInfo from "./info/ProposalInfo";
import {ProposalContentType} from "./ProposalContentTypeTabs";
import ProposalMilestones from "./milestones/ProposalMilestones";
import ProposalDiscussion from "./discussion/ProposalDiscussion";
import ProposalVoting from "./voting/ProposalVoting";
import ProposalHeader from "./discussion/ProposalHeader";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: '100vh',
            width: '100%',
            backgroundColor: theme.palette.background.paper
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
        }
    }),
);

const Proposal: React.FC = () => {
    const classes = useStyles()

    let {path} = useRouteMatch();

    return (
        <div className={classes.root}>
            <ProposalHeader/>
            <div className={classes.content}>
                <Switch>
                    <Route exact={true} path={path}>
                        <ProposalInfo/>
                    </Route>
                    <Route exact={true} path={`${path}/${ProposalContentType.Info}`}>
                        <ProposalInfo/>
                    </Route>
                    <Route exact={true} path={`${path}/${ProposalContentType.Milestones}`}>
                        <ProposalMilestones/>
                    </Route>
                    <Route exact={true} path={`${path}/${ProposalContentType.Discussion}`}>
                        <ProposalDiscussion/>
                    </Route>
                    <Route exact={true} path={`${path}/${ProposalContentType.Voting}`}>
                        <ProposalVoting/>
                    </Route>
                </Switch>
            </div>
        </div>
    );
}

export default Proposal
