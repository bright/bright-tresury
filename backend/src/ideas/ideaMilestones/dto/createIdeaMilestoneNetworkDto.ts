import { OmitType } from '@nestjs/swagger'
import { IdeaMilestoneNetworkDto } from './ideaMilestoneNetworkDto'

export class CreateIdeaMilestoneNetworkDto extends OmitType(IdeaMilestoneNetworkDto, ['extrinsic'] as const) { }
