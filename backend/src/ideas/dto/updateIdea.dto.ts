import {PartialType} from "@nestjs/swagger";
import {CreateIdeaDto} from "./createIdea.dto";

export class UpdateIdeaDto extends PartialType(CreateIdeaDto) {}
