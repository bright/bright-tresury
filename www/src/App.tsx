import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import Ideas from './ideas/Ideas';
import IdeaDetails from './ideas/IdeaDetails';
import Menu from './main/Menu';
import Proposals from './proposals/Proposals';
import {ROUTE_IDEA, ROUTE_IDEAS, ROUTE_NEW_IDEA, ROUTE_PROPOSALS, ROUTE_ROOT} from './routes';
import Stats from './stats/Stats';
import {SubstrateContextProvider} from './substrate-lib';
import Main from './main/Main';
import i18next from "i18next";
import {getTranslation} from "./translation/translationStorage";
import {ThemeWrapper} from "./theme/ThemeWrapper";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
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
                    <Route exact={true} path={ROUTE_ROOT} component={Stats}/>
                    <Route exact={true} path={ROUTE_PROPOSALS} component={Proposals}/>
                    <Route exact={true} path={ROUTE_IDEAS} component={Ideas}/>
                    <Route exact={true} path={ROUTE_NEW_IDEA} component={IdeaDetails}/>
                    <Route exact={true} path={ROUTE_IDEA} component={IdeaDetails}/>
                </Switch>
            </div>
        </Router>
    )
}

function App() {
    return (
        <SubstrateContextProvider>
            <ThemeWrapper>
                <Main>
                    <AppRoutes/>
                </Main>
            </ThemeWrapper>
        </SubstrateContextProvider>
    )
}

export default App;
