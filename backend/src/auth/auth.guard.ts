import { UseGuards } from "@nestjs/common";
import { AuthGuard as PassportAuthGuard } from "@nestjs/passport";
import { compose } from "../utils/decorators";
import { ApiBearerAuth } from "@nestjs/swagger";

export const AuthGuard = () => PassportAuthGuard('jwt')
export const UseAuth = () => compose(ApiBearerAuth(), UseGuards(AuthGuard()))
