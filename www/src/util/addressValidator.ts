import {decodeAddress, encodeAddress} from '@polkadot/keyring';
import {hexToU8a, isHex} from '@polkadot/util';

export function isValidAddress(address: string): boolean {
    try {
        encodeAddress(
            isHex(address)
                ? hexToU8a(address)
                : decodeAddress(address)
        );

        return true;
    } catch (error) {
        return false;
    }
};

export function isValidAddressOrEmpty(address?: string): boolean {
    return !address || isValidAddress(address)
}
