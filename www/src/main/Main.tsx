import React, { createRef, useState } from "react";
import { Dimmer, Grid, Loader, Message } from "semantic-ui-react";
import { useSubstrate } from "../substrate-lib";
import { DeveloperConsole } from "../substrate-lib/components";

const Main: React.FC<{}> = ({ children }) => {
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
            {children}
            <DeveloperConsole />
        </div>
    );
}

export default Main
