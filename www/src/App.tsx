import { createStyles, makeStyles } from '@material-ui/core/styles'
import i18next from 'i18next'
import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css'
import Account from './auth/account/Account'
import { AuthContextProvider } from './auth/AuthContext'
import SignIn from './auth/sign-in/SignIn'
import SignUp from './auth/sign-up/SignUp'
import {EmailNotVerified} from "./auth/verifyEmail/EmailNotVerified";
import { IdeaCreate } from './ideas/create/IdeaCreate'
import { TurnIdeaIntoProposal } from './ideas/idea/turnIntoProposal/TurnIdeaIntoProposal'
import { Idea } from './ideas/idea/Idea'
import { Ideas } from './ideas/Ideas'
import Main from './main/Main'
import { Proposal } from './proposals/proposal/Proposal'
import { Proposals } from './proposals/Proposals'
import { PrivateRoute } from './routes/PrivateRoute'
import { PublicOnlyRoute } from './routes/PublicOnlyRoute'
import {
    ROUTE_ACCOUNT,
    ROUTE_EDIT_IDEA,
    ROUTE_EMAIL_NOT_VERIFIED,
    ROUTE_IDEA,
    ROUTE_IDEAS,
    ROUTE_NEW_IDEA,
    ROUTE_PROPOSAL,
    ROUTE_PROPOSALS,
    ROUTE_ROOT,
    ROUTE_SIGNIN,
    ROUTE_SIGNUP,
    ROUTE_SIGNUP_WEB3_SUCCESS,
    ROUTE_STATS,
    ROUTE_TURN_IDEA,
    ROUTE_VERIFY_EMAIL,
} from './routes/routes'
import Stats from './stats/Stats'
import { initializeSupertokens } from './supertokens'
import { ThemeWrapper } from './theme/ThemeWrapper'
import { getTranslation } from './translation/translationStorage'
import VerifyEmail from './auth/verifyEmail/VerifyEmail'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AccountsContextProvider } from './substrate-lib/accounts/AccountsContext'
import { SubstrateContextProvider } from './substrate-lib/api/SubstrateContext'
import { Web3SignUpSuccess } from './auth/sign-up/web3/Web3SignUpSuccess'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: '100%',
            height: '100vh',
        },
    }),
)

const queryClient = new QueryClient()

function AppRoutes() {
    const classes = useStyles()
    useEffect(() => {
        i18next.changeLanguage(getTranslation()).then()
    })

    return (
        <div className={classes.root}>
            <Router>
                <Main>
                    <Switch>
                        <PublicOnlyRoute
                            exact={false}
                            path={ROUTE_SIGNUP}
                            component={SignUp}
                            redirectTo={ROUTE_SIGNUP_WEB3_SUCCESS}
                        />
                        <PublicOnlyRoute exact={false} path={ROUTE_SIGNIN} component={SignIn} />
                        <Route exact={true} path={ROUTE_SIGNUP_WEB3_SUCCESS} component={Web3SignUpSuccess} />
                        <Route exact={true} path={ROUTE_EMAIL_NOT_VERIFIED}>
                            <EmailNotVerified />
                        </Route>
                        <Route exact={true} path={ROUTE_VERIFY_EMAIL}>
                            <VerifyEmail />
                        </Route>
                        <Route exact={true} path={ROUTE_ROOT} component={Stats} />
                        <Route exact={true} path={ROUTE_STATS} component={Stats} />
                        <Route exact={true} path={ROUTE_PROPOSALS} component={Proposals} />
                        <Route exact={false} path={ROUTE_PROPOSAL} component={Proposal} />
                        <Route exact={true} path={ROUTE_IDEAS} component={Ideas} />
                        <PrivateRoute
                            exact={true}
                            path={ROUTE_NEW_IDEA}
                            component={IdeaCreate}
                            requireVerified={true}
                        />
                        <PrivateRoute
                            exact={true}
                            path={ROUTE_TURN_IDEA}
                            component={TurnIdeaIntoProposal}
                            requireVerified={true}
                        />
                        <PrivateRoute exact={true} path={ROUTE_EDIT_IDEA} component={Idea} requireVerified={true} />
                        <Route exact={false} path={ROUTE_IDEA} component={Idea} />
                        <PrivateRoute exact={false} path={ROUTE_ACCOUNT} component={Account} requireVerified={false} />
                    </Switch>
                </Main>
            </Router>
        </div>
    )
}

initializeSupertokens()

function App() {
    console.log('front-end hello')
    return (
        <QueryClientProvider client={queryClient}>
            <AuthContextProvider>
                <SubstrateContextProvider>
                    <AccountsContextProvider>
                        <ThemeWrapper>
                            <AppRoutes />
                        </ThemeWrapper>
                    </AccountsContextProvider>
                </SubstrateContextProvider>
            </AuthContextProvider>
        </QueryClientProvider>
    )
}

export default App
