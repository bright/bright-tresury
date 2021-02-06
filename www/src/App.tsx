import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import i18next from "i18next";
import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import Ideas from './ideas/Ideas';
import Menu from './main/Menu';
import Proposals from './proposals/Proposals';
import {
    ROUTE_EDIT_IDEA,
    ROUTE_IDEA,
    ROUTE_IDEAS,
    ROUTE_NEW_IDEA,
    ROUTE_PROPOSAL,
    ROUTE_PROPOSALS,
    ROUTE_ROOT
} from './routes';
import Stats from './stats/Stats';
import {ThemeWrapper} from "./theme/ThemeWrapper";
import {getTranslation} from "./translation/translationStorage";
import {SubstrateContextProvider} from './substrate-lib';
import CreateIdea from "./ideas/create/CreateIdea";
import Idea from "./ideas/idea/Idea";
import {breakpoints} from "./theme/theme";
import {getSuperTokensRoutesForReactRouterDom} from "supertokens-auth-react";
import {EmailPasswordAuth} from "supertokens-auth-react/lib/build/recipe/emailpassword";
import {initializeSupertokens} from "./supertokens";
import Proposal from "./proposals/proposal/Proposal";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                flexDirection: 'column'
            },
        }
    }),
);

function AppRoutes() {
    const classes = useStyles();
    useEffect(() => {
        i18next.changeLanguage(getTranslation()).then()
    })
    return (
        <Router>
            <div className={classes.root}>
                <Menu/>
                <Switch>
                    {getSuperTokensRoutesForReactRouterDom()}
                    <Route path="/dashboard">
                        <EmailPasswordAuth>
                            <div>
                                Supertokens worked!
                            </div>
                        </EmailPasswordAuth>
                    </Route>

                    <Route exact={true} path={ROUTE_ROOT} component={Stats}/>
                    <Route exact={true} path={ROUTE_PROPOSALS} component={Proposals}/>
                    <Route exact={false} path={ROUTE_PROPOSAL} component={Proposal}/>
                    <Route exact={true} path={ROUTE_IDEAS} component={Ideas}/>
                    <Route exact={true} path={ROUTE_NEW_IDEA} component={CreateIdea}/>
                    <Route exact={true} path={ROUTE_EDIT_IDEA} component={Idea}/>
                    <Route exact={false} path={ROUTE_IDEA} component={Idea}/>
                </Switch>
            </div>
        </Router>
    )
}

initializeSupertokens()

function App() {
    console.log('front-end hello')
    return (
        <SubstrateContextProvider>
            <ThemeWrapper>
                <AppRoutes/>
            </ThemeWrapper>
        </SubstrateContextProvider>
    )
}

export default App;
