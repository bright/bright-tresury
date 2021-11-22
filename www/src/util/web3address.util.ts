/**
 * It compares if the addresses are the same, even if encoded differently
 * @param address1
 * @param address2
 */
import { decodeAddress, encodeAddress } from '@polkadot/keyring'

export function compareWeb3Address(address1: string, address2: string): boolean {
    try {
        const baseEncoded1 = encodeAddress(decodeAddress(address1), 42)
        const baseEncoded2 = encodeAddress(decodeAddress(address2), 42)
        return baseEncoded1 === baseEncoded2
    } catch {
        return false
    }
}
