import { ConfirmSignMessageRequestDto } from '../../signMessage/confirm-sign-message-request.dto'
import { SessionData } from '../../../session/session.decorator'

export class ConfirmWeb3AssociateRequestDto extends ConfirmSignMessageRequestDto {
    session!: SessionData
}
