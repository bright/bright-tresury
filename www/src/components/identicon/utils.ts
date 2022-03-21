import { encodeAddress } from '@polkadot/util-crypto'
import { ellipseTextInTheMiddle } from '../../util/stringUtil'
import { Nil } from '../../util/types'

export function formatAddress(address: Nil<string>, ss58Format: number, ellipsis: boolean = true): string {
    if (!address) {
        return ''
    }
    const encodedAddress = encodeAddress(address, ss58Format)
    return ellipsis ? ellipseTextInTheMiddle(encodedAddress, 12) : encodedAddress
}
