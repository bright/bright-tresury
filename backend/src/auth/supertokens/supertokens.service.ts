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

    getUsernameValidationError = async (value: string): Promise<string | undefined> => {
        const valid = await this.usersService.validateUsername(value)
        return valid ? undefined : "Username already taken"
    }

    handleSignUp = async (user: User, formFields: Array<{
        id: string;
        value: any;
    }>): Promise<void> => {
        const {id, email} = user
        const usernameFormField = formFields.find(({id: formFieldKey}) =>
            formFieldKey === SuperTokensUsernameKey
        )
        if (!usernameFormField) {
            throw new BadRequestException('Username was not found.')
        }
        const createUserDto = {
            authId: id,
            email,
            username: usernameFormField.value
        } as CreateUserDto
        await this.usersService.create(createUserDto).catch(() => {
            throw new BadRequestException()
        })
    }
}
