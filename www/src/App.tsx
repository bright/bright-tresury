import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Ideas from './ideas/Ideas';
import Menu from './main/Menu';
import Proposals from './proposals/Proposals';
import { ROUTE_IDEAS, ROUTE_PROPOSALS, ROUTE_ROOT } from './routes';
import Stats from './stats/Stats';
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
    return (
        <Router>
            <div className={classes.root}>
                <Menu />
                <Switch>
                    <Route exact={true} path={ROUTE_ROOT} component={Stats} />
                    <Route exact={true} path={ROUTE_PROPOSALS} component={Proposals} />
                    <Route exact={true} path={ROUTE_IDEAS} component={Ideas} />
                </Switch>
            </div>
        </Router>
    )
}

function App() {
    return (
        <SubstrateContextProvider>
            {/* <Main> */}
            <AppRoutes />
            {/* </Main> */}
        </SubstrateContextProvider>
    )
}

export default App;
