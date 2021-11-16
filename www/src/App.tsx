import { createStyles, makeStyles } from '@material-ui/core/styles'
import i18next from 'i18next'
import React, { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import Bounties from './bounties/Bounties'
import './App.css'
import Account from './auth/account/Account'
import { AuthContextProvider } from './auth/AuthContext'
import SignIn from './auth/sign-in/SignIn'
import EmailSignUpSuccess from './auth/sign-up/email/EmailSignUpSucces'
import SignUp from './auth/sign-up/SignUp'
import Web3SignUpSuccess from './auth/sign-up/web3/Web3SignUpSuccess'
import EmailNotVerified from './auth/verifyEmail/EmailNotVerified'
import VerifyEmail from './auth/verifyEmail/VerifyEmail'
import BountyLoader from './bounties/bounty/BountyLoader'
import IdeaCreate from './ideas/create/IdeaCreate'
import Ideas from './ideas/Ideas'
import Main from './main/Main'
import NetworksContextProvider from './networks/NetworksContext'
import Proposal from './proposals/proposal/Proposal'
import Proposals from './proposals/Proposals'
import PrivateRoute from './routes/PrivateRoute'
import { PublicOnlyRoute } from './routes/PublicOnlyRoute'
import Route from './routes/Route'
import {
    ROUTE_ACCOUNT,
    ROUTE_BOUNTIES,
    ROUTE_BOUNTY,
    ROUTE_EMAIL_NOT_VERIFIED,
    ROUTE_IDEA,
    ROUTE_IDEAS,
    ROUTE_NEW_BOUNTY,
    ROUTE_NEW_IDEA,
    ROUTE_PROPOSAL,
    ROUTE_PROPOSALS,
    ROUTE_ROOT,
    ROUTE_SIGNIN,
    ROUTE_SIGNUP,
    ROUTE_SIGNUP_EMAIL_SUCCESS,
    ROUTE_SIGNUP_WEB3_SUCCESS,
    ROUTE_STATS,
    ROUTE_VERIFY_EMAIL,
} from './routes/routes'
import Stats from './stats/Stats'
import { AccountsContextProvider } from './substrate-lib/accounts/AccountsContext'
import { SubstrateContextProvider } from './substrate-lib/api/SubstrateContext'
import { initializeSupertokens } from './supertokens'
import ThemeWrapper from './theme/ThemeWrapper'
import { getTranslation } from './translation/translationStorage'
import IdeaLoader from './ideas/idea/IdeaLoader'
import BountyCreate from './bounties/create/BountyCreate'

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
    useEffect(() => {
        i18next.changeLanguage(getTranslation()).then()
    })

    return (
        <Main>
            <Switch>
                <PublicOnlyRoute exact={false} path={ROUTE_SIGNUP} component={SignUp} />
                <PublicOnlyRoute exact={false} path={ROUTE_SIGNIN} component={SignIn} />
                <PrivateRoute
                    requireVerified={false}
                    exact={true}
                    path={ROUTE_SIGNUP_WEB3_SUCCESS}
                    component={Web3SignUpSuccess}
                />
                <PrivateRoute
                    requireVerified={false}
                    exact={true}
                    path={ROUTE_SIGNUP_EMAIL_SUCCESS}
                    component={EmailSignUpSuccess}
                />
                <Route exact={true} path={ROUTE_EMAIL_NOT_VERIFIED} component={EmailNotVerified} />
                <Route exact={true} path={ROUTE_VERIFY_EMAIL} component={VerifyEmail} />
                <Route exact={true} path={ROUTE_ROOT} component={Stats} />
                <Route exact={true} path={ROUTE_STATS} component={Stats} />
                <Route exact={true} path={ROUTE_PROPOSALS} component={Proposals} />
                <Route exact={false} path={ROUTE_PROPOSAL} component={Proposal} />
                <Route exact={true} path={ROUTE_BOUNTIES} component={Bounties} />
                <PrivateRoute exact={true} path={ROUTE_NEW_BOUNTY} component={BountyCreate} requireVerified={true} />
                <Route exact={false} path={ROUTE_BOUNTY} component={BountyLoader} />
                <Route exact={true} path={ROUTE_IDEAS} component={Ideas} />
                <PrivateRoute exact={true} path={ROUTE_NEW_IDEA} component={IdeaCreate} requireVerified={true} />
                <Route exact={false} path={ROUTE_IDEA} component={IdeaLoader} />
                <PrivateRoute exact={false} path={ROUTE_ACCOUNT} component={Account} requireVerified={false} />
            </Switch>
        </Main>
    )
}

initializeSupertokens()

function App() {
    console.log('front-end hello')
    const classes = useStyles()
    return (
        <QueryClientProvider client={queryClient}>
            <div className={classes.root}>
                <Router>
                    <NetworksContextProvider>
                        <AuthContextProvider>
                            <ThemeWrapper>
                                <SubstrateContextProvider>
                                    <AccountsContextProvider>
                                        <AppRoutes />
                                    </AccountsContextProvider>
                                </SubstrateContextProvider>
                            </ThemeWrapper>
                        </AuthContextProvider>
                    </NetworksContextProvider>
                </Router>
            </div>
        </QueryClientProvider>
    )
}

export default App
