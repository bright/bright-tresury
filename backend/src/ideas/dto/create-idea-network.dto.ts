import { OmitType } from '@nestjs/swagger'
import { IdeaNetworkDto } from './idea-network.dto'

export class CreateIdeaNetworkDto extends OmitType(IdeaNetworkDto, ['extrinsic'] as const) {}
