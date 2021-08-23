import { encodeAddress } from '@polkadot/keyring'
import { Transform } from 'class-transformer'
import { isValidAddress } from './address.validator'

export function TransformAddress() {
    return Transform(({ value }) => (isValidAddress(value) ? encodeAddress(value) : value))
}
