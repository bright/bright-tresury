import React, { createRef, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import { Container, Dimmer, Loader, Grid, Sticky, Message } from 'semantic-ui-react';
import './App.css';
import { ROUTE_ROOT } from './routes';
import { useSubstrate, SubstrateContextProvider } from './substrate-lib';
import { DeveloperConsole } from './substrate-lib/components';
import { Dimmer, Loader, Grid, Message } from 'semantic-ui-react';
import Home from './home/Home';


function AppRoutes() {
  return (
    <Router>
      <Switch>
        <Route exact={true} path={ROUTE_ROOT} component={Main} />
      </Switch>
    </Router>
  )
}

function Main() {
  const [accountAddress, setAccountAddress] = useState(null);
  const { apiState, keyring, keyringState, apiError } = useSubstrate();
  const accountPair =
    accountAddress &&
    keyringState === 'READY' &&
    keyring.getPair(accountAddress);

    const loader = (text: any) =>
    <Dimmer active>
      <Loader size='small'>{text}</Loader>
    </Dimmer>;

  const message = (err: any) =>
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message negative compact floating
          header='Error Connecting to Substrate'
          content={`${err}`}
        />
      </Grid.Column>
    </Grid>;


  if (apiState === 'ERROR') return message(apiError);
  else if (apiState !== 'READY') return loader('Connecting to Substrate');

  if (keyringState !== 'READY') {
    return loader('Loading accounts (please review any extension\'s authorization)');
  }

  const contextRef = createRef<HTMLDivElement>();

  return (
    <div ref={contextRef}>
      <Home/>
      <DeveloperConsole />
    </div>
  );
}

function App() {
  return (
    <SubstrateContextProvider>
      <AppRoutes />
    </SubstrateContextProvider>
  )
}

export default App;
