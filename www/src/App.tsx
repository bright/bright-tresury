import { createStyles, makeStyles } from '@material-ui/core/styles'
import i18next from 'i18next'
import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css'
import Account from './auth/account/Account'
import { AuthContextProvider } from './auth/AuthContext'
import SignIn from './auth/sign-in/SignIn'
import SignUp from './auth/sign-up/SignUp'
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
    ROUTE_EMAIL_NOT_VERIFIED,
} from './routes/routes'
import Stats from './stats/Stats'
import { SubstrateContextProvider } from './substrate-lib'
import { initializeSupertokens } from './supertokens'
import { ThemeWrapper } from './theme/ThemeWrapper'
import { getTranslation } from './translation/translationStorage'
import { SignUpSuccess } from './auth/sign-up/common/SignUpSuccess'
import VerifyEmail from './auth/sign-in/email/VerifyEmail'
import { QueryClientProvider, QueryClient } from 'react-query'
import { EmailNotVerified } from './auth/email-not-verified/EmailNotVerified'

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
                        <Route exact={true} path={ROUTE_SIGNUP_WEB3_SUCCESS} component={SignUpSuccess} />
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
                        <PrivateRoute exact={true} path={ROUTE_NEW_IDEA} component={IdeaCreate} />
                        <PrivateRoute exact={true} path={ROUTE_TURN_IDEA} component={TurnIdeaIntoProposal} />
                        <PrivateRoute exact={true} path={ROUTE_EDIT_IDEA} component={Idea} />
                        <Route exact={false} path={ROUTE_IDEA} component={Idea} />
                        <Route exact={false} path={ROUTE_ACCOUNT} component={Account} />
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
                    <ThemeWrapper>
                        <AppRoutes />
                    </ThemeWrapper>
                </SubstrateContextProvider>
            </AuthContextProvider>
        </QueryClientProvider>
    )
}

export default App
