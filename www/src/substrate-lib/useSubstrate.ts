import { useContext, useEffect, useCallback } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import keyring from '@polkadot/ui-keyring';

import config from '../config';
import { SubstrateContext } from './SubstrateContext';

const useSubstrate = () => {
    const [state, dispatch] = useContext(SubstrateContext);

    const { api, socket, jsonrpc, types } = state;

    const connect = useCallback(async () => {
        if (api || dispatch === undefined) {
            return
        }

        const provider = new WsProvider(socket);
        const _api = new ApiPromise({ provider, types, rpc: jsonrpc });

        // We want to listen to event for disconnection and reconnection.
        //  That's why we set for listeners.
        _api.on('connected', () => {
            dispatch({ type: 'CONNECT', api: _api });
            // `ready` event is not emitted upon reconnection. So we check explicitly here.
            _api.isReady.then((_api) => dispatch({ type: 'CONNECT_SUCCESS' }));
        });
        _api.on('ready', () => dispatch({ type: 'CONNECT_SUCCESS' }));
        _api.on('error', err => dispatch({ type: 'CONNECT_ERROR', apiError: err }));
    }, [api, socket, jsonrpc, types, dispatch]);

    const { keyringState } = state;
    const loadAccounts = useCallback(async () => {
        if (keyringState || dispatch === undefined) {
            return;
        }

        try {
            await web3Enable(config.APP_NAME);
            let allAccounts = await web3Accounts();
            allAccounts = allAccounts.map(({ address, meta }) =>
                ({ address, meta: { ...meta, name: `${meta.name} (${meta.source})` } }));

            keyring.loadAll({ isDevelopment: config.DEVELOPMENT_KEYRING }, allAccounts);
            dispatch({ type: 'SET_KEYRING', keyring: keyring });
        } catch (e) {
            console.error(e);
            dispatch({ type: 'KEYRING_ERROR' });
        }
    }, [keyringState, dispatch]);

    useEffect(() => {
        connect();
    }, [connect]);

    useEffect(() => {
        loadAccounts();
    }, [loadAccounts]);

    return { ...state, dispatch };
};

export default useSubstrate;
