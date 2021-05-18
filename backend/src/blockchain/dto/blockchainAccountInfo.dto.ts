import {DeriveAccountRegistration} from "@polkadot/api-derive/types";
import {getLogger} from "../../logging.module";

export interface BlockchainAccountInfo {
    address: string,
    display?: string;
    email?: string;
    legal?: string;
    riot?: string;
    twitter?: string;
    web?: string;
}

export function toBlockchainAccountInfo (address: string, deriveAccountRegistration: DeriveAccountRegistration | undefined): BlockchainAccountInfo {
    getLogger().info('toBlockchainAccountInfo:', deriveAccountRegistration);
    const {display, email, legal, riot, twitter, web} = deriveAccountRegistration || {}
    return {
        address, display, email, legal, riot, twitter, web
    } as BlockchainAccountInfo
}
