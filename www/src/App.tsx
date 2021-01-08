import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import i18next from "i18next";
import React, {useEffect} from 'react';
import {BrowserRouter as Router, generatePath, Redirect, Route, Switch} from 'react-router-dom';
import './App.css';
import Ideas from './ideas/Ideas';
import Menu from './main/Menu';
import Proposals from './proposals/Proposals';
import {
    ROUTE_EDIT_IDEA,
    ROUTE_IDEA,
    ROUTE_IDEAS,
    ROUTE_IDEAS_FILTERED,
    ROUTE_NEW_IDEA,
    ROUTE_PROPOSALS,
    ROUTE_ROOT
} from './routes';
import Stats from './stats/Stats';
import {ThemeWrapper} from "./theme/ThemeWrapper";
import {getTranslation} from "./translation/translationStorage";
import {SubstrateContextProvider} from './substrate-lib';
import CreateIdea from "./ideas/create/CreateIdea";
import Idea from "./ideas/idea/Idea";
import {IdeaFilter} from "./ideas/list/IdeaStatusFilters";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            width: '100vw'
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
                    <Route exact={true} path={ROUTE_IDEAS}>
                        <Redirect to={generatePath(ROUTE_IDEAS_FILTERED, {filter: IdeaFilter.All})}/>
                    </Route>
                    <Route path={ROUTE_IDEAS_FILTERED} component={Ideas}/>
                    <Route exact={true} path={ROUTE_NEW_IDEA} component={() => <CreateIdea network={'localhost'}/>}/>
                    <Route exact={true} path={ROUTE_EDIT_IDEA} component={() => <Idea network={'localhost'}/>}/>
                    <Route path={ROUTE_IDEA} component={() => <Idea network={'localhost'}/>}/>
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
