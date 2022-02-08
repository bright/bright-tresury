import { Injectable } from '@nestjs/common'
import { signatureVerify } from '@polkadot/util-crypto'
import { ConfirmSignMessageRequestDto } from './dto/confirm-sign-message-request.dto'

@Injectable()
export class SignatureValidator {
    validateSignature = (signMessage: string, confirmRequest: ConfirmSignMessageRequestDto): boolean => {
        const { isValid } = signatureVerify(signMessage, confirmRequest.signature, confirmRequest.address)
        return isValid
    }
}
