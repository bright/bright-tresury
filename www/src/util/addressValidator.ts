import { checkAddress } from '@polkadot/util-crypto'
import { Nil } from './types'

export function isValidAddress(address: string, ss58format?: number): boolean {
    try {
        const [isValid] = checkAddress(address, ss58format ?? 0)
        return isValid
    } catch (error) {
        return false
    }
}

export function isValidAddressOrEmpty(address: Nil<string>, ss58format?: number): boolean {
    return !address || isValidAddress(address, ss58format)
}
