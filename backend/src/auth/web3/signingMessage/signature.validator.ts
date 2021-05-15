import { Injectable } from '@nestjs/common'
import { decodeAddress, signatureVerify } from '@polkadot/util-crypto'
import { u8aToHex } from '@polkadot/util'
import { ConfirmSignMessageRequestDto } from './confirm-sign-message-request.dto'

@Injectable()
export class SignatureValidator {
    validateSignature = (signMessage: string, confirmRequest: ConfirmSignMessageRequestDto): boolean => {
        const publicAddressKey = decodeAddress(confirmRequest.address)
        const publicHexAddressKey = u8aToHex(publicAddressKey)

        const result = signatureVerify(signMessage, confirmRequest.signature, publicHexAddressKey)
        return result.isValid
    }
}
