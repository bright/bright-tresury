import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import i18next from "i18next";
import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import IdeaDetails, {IdeaDetailsState} from './ideas/IdeaDetails';
import Ideas from './ideas/Ideas';
import Menu from './main/Menu';
import Proposals from './proposals/Proposals';
import {ROUTE_IDEA, ROUTE_IDEAS, ROUTE_NEW_IDEA, ROUTE_PROPOSALS, ROUTE_ROOT} from './routes';
import Stats from './stats/Stats';
import {ThemeWrapper} from "./theme/ThemeWrapper";
import {getTranslation} from "./translation/translationStorage";
import { SubstrateContextProvider } from './substrate-lib';

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
                    <Route exact={true} path={ROUTE_NEW_IDEA} component={() =>
                        <IdeaDetails
                            network={'localhost'}
                            state={IdeaDetailsState.EDITABLE}
                    />}/>
                    <Route exact={true} path={ROUTE_IDEA} component={() =>
                        <IdeaDetails
                            network={'localhost'}
                            state={IdeaDetailsState.STATIC_DETAILS}
                        />}/>
                </Switch>
            </div>
        </Router>
    )
}

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
