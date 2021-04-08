import {PartialType} from "@nestjs/swagger";
import {CreateIdeaMilestoneDto} from "./createIdeaMilestoneDto";

export class UpdateIdeaMilestoneDto extends PartialType(CreateIdeaMilestoneDto) { }
