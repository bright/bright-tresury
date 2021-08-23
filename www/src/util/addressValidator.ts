import { decodeAddress, encodeAddress } from '@polkadot/keyring'
import { hexToU8a, isHex } from '@polkadot/util'
import { Nil } from './types'

export function isValidAddress(address: string, ss58format: number): boolean {
    try {
        encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address, true, ss58format), ss58format)

        return true
    } catch (error) {
        return false
    }
}

export function isValidAddressOrEmpty(address: Nil<string>, ss58format: number): boolean {
    return !address || isValidAddress(address, ss58format)
}
