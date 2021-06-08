import { OmitType } from '@nestjs/swagger'
import { IdeaMilestoneNetworkDto } from './idea-milestone-network.dto'

export class CreateIdeaMilestoneNetworkDto extends OmitType(IdeaMilestoneNetworkDto, ['extrinsic'] as const) {}
