import {OmitType} from "@nestjs/swagger";
import {IdeaNetworkDto} from "./ideaNetwork.dto";

export class CreateIdeaNetworkDto extends OmitType(IdeaNetworkDto, ['extrinsic'] as const) {}
