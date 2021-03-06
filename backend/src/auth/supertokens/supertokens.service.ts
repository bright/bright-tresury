import {BadRequestException, Injectable} from "@nestjs/common";
import {UsersService} from "../../users/users.service";
import {User} from "supertokens-node/lib/build/recipe/emailpassword/types";
import {CreateUserDto} from "../../users/dto/createUser.dto";
import {SuperTokensUsernameKey} from "./supertokens.recipeList";

@Injectable()
export class SuperTokensService {
    constructor(
        private readonly usersService: UsersService,
    ) {
    }

    validateUsername = async (value: string): Promise<string | undefined> => {
        const valid = await this.usersService.validateUsername(value)
        return valid ? undefined : "Username already taken"
    }

    validateEmail = async (value: string): Promise<string | undefined> => {
        const valid = await this.usersService.validateEmail(value)
        return valid ? undefined : "Email already used"
    }

    handleSignUp = async (user: User, formFields: Array<{
        id: string;
        value: any;
    }>): Promise<void> => {
        const {id, email} = user
        const username = formFields.find((formField: { id: string, value: any }) =>
            formField.id === SuperTokensUsernameKey
        )!.value
        const createUserDto = {
            authId: id,
            email,
            username
        } as CreateUserDto
        await this.usersService.create(createUserDto).catch(() => {
            throw new BadRequestException()
        })
    }
}
