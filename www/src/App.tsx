import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import i18next from "i18next";
import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import './App.css';
import {AuthContextProvider, useAuth} from "./auth/AuthContext";
import SignIn from "./auth/sign-in/SignIn";
import Ideas from './ideas/Ideas';
import Main from "./main/Main";
import Proposals from './proposals/Proposals';
import {
    ROUTE_CONVERT_IDEA, ROUTE_EDIT_IDEA, ROUTE_IDEA, ROUTE_IDEAS, ROUTE_NEW_IDEA, ROUTE_PROPOSAL,
    ROUTE_PROPOSALS,
    ROUTE_ROOT, ROUTE_SIGNIN, ROUTE_SIGNUP, ROUTE_STATS
} from './routes';
import Stats from './stats/Stats';
import {ThemeWrapper} from "./theme/ThemeWrapper";
import {getTranslation} from "./translation/translationStorage";
import {SubstrateContextProvider} from './substrate-lib';
import IdeaCreate from "./ideas/create/IdeaCreate";
import Idea from "./ideas/idea/Idea";
import {breakpoints} from "./theme/theme";
import {getSuperTokensRoutesForReactRouterDom} from "supertokens-auth-react";
import {EmailPasswordAuth} from "supertokens-auth-react/lib/build/recipe/emailpassword";
import {initializeSupertokens} from "./supertokens";
import ConvertIdeaToProposal from './ideas/idea/convertToProposal/ConvertIdeaToProposal';
import Proposal from "./proposals/proposal/Proposal";
import SignUp from './auth/sign-up/SignUp';


function AppRoutes() {
    const {isUserSignedIn} = useAuth()
    useEffect(() => {
        i18next.changeLanguage(getTranslation()).then()
    })
    return (
        <Router>
            <Main>
                <Switch>
                    <Route exact={true} path={ROUTE_SIGNUP} >
                        {isUserSignedIn ? <Redirect to={ROUTE_STATS}/> : <SignUp/>}
                    </Route>
                    <Route exact={true} path={ROUTE_SIGNIN}>
                        {isUserSignedIn ? <Redirect to={ROUTE_STATS}/> : <SignIn/>}
                    </Route>
                    <Route exact={true} path={ROUTE_ROOT} component={Stats}/>
                    <Route exact={true} path={ROUTE_PROPOSALS} component={Proposals}/>
                    <Route exact={false} path={ROUTE_PROPOSAL} component={Proposal}/>
                    <Route exact={true} path={ROUTE_IDEAS} component={Ideas}/>
                    <Route exact={true} path={ROUTE_NEW_IDEA} component={IdeaCreate}/>
                    <Route exact={true} path={ROUTE_CONVERT_IDEA} component={ConvertIdeaToProposal}/>
                    <Route exact={true} path={ROUTE_EDIT_IDEA} component={Idea}/>
                    <Route exact={false} path={ROUTE_IDEA} component={Idea}/>
                </Switch>
            </Main>
        </Router>
    )
}

initializeSupertokens()

function App() {
    console.log('front-end hello')
    return (
        <AuthContextProvider>
            <SubstrateContextProvider>
                <ThemeWrapper>
                    <AppRoutes/>
                </ThemeWrapper>
            </SubstrateContextProvider>
        </AuthContextProvider>
    )
}

export default App;
