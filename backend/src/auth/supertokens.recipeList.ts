import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";
import {UsersService} from "../users/users.service";
import {CreateUserDto} from "../users/dto/createUser.dto";
import {BadRequestException} from "@nestjs/common";

const usernameKey = 'username'

export const getRecipeList = (usersService: UsersService) => [
    EmailPassword.init({
        signUpFeature: {
            formFields: [{
                id: usernameKey,
                validate: async (username) => {
                    return undefined; // means that there is no error
                    // const existingUser = usersService.findOneByUsername(username)
                    // if (!existingUser) {
                    //     return undefined; // means that there is no error
                    // }
                    // return "Username already taken";
                }
            }, {
                id: "email",
                validate: async (email) => {
                    return undefined; // means that there is no error
                    // const existingUser = usersService.findOneByEmail(email)
                    // if (!existingUser) {
                    //     return undefined; // means that there is no error
                    // }
                    // return "Email already used";
                }
            }],
            handleCustomFormFieldsPostSignUp: async (user: any, formFields) => {
                // tslint:disable-next-line:no-console
                console.error(`\n\n\n User: ${JSON.stringify(user)} \n\n\n FormFields: ${JSON.stringify(formFields)}`)
                const {id, email} = user
                const username = formFields.find((formField: { id: string, value: any }) =>
                    formField.id === usernameKey
                )!.value
                const createUserDto = {
                    id,
                    email,
                    username
                } as CreateUserDto
                // tslint:disable-next-line:no-console
                console.error(`\n\n\n CreateUserDto: ${JSON.stringify(createUserDto)}`)
                await usersService.create(createUserDto).catch(() => {
                    throw new BadRequestException()
                })
            }
        },
    }),
    Session.init()
]
