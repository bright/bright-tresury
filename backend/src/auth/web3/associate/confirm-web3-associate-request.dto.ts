import { ConfirmSignMessageRequestDto } from '../signingMessage/confirm-sign-message-request.dto'
import { SessionData } from '../../session/session.decorator'

export class ConfirmWeb3AssociateRequestDto extends ConfirmSignMessageRequestDto {
    session!: SessionData
}
