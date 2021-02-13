import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from "./user.entity";
import {CreateUserDto} from "./dto/createUser.dto";
import {validate, validateOrReject} from "class-validator";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
    }

    async findOne(id: string): Promise<User> {
        const user = await this.userRepository.findOne(id)
        if (!user) {
            throw new NotFoundException('There is no user with such id')
        }
        return user
    }

    async findOneByUsername(username: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {username}
        })
        if (!user) {
            throw new NotFoundException('There is no user with such id')
        }
        return user
    }

    async findOneByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {email}
        })
        if (!user) {
            throw new NotFoundException('There is no user with such id')
        }
        return user
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        await validate(createUserDto).then((errors) => {
            // tslint:disable-next-line:no-console
            console.error(`\n\n\nERRORS CREATEUSERDTO ${JSON.stringify(errors)}`)
        })
        await validateOrReject(createUserDto)
        const user = new User(
            createUserDto.id,
            createUserDto.username,
            createUserDto.email
        )
        const createdUser = await this.userRepository.save(user)
        return (await this.userRepository.findOne(createdUser.id))!
    }

    async delete(id: string) {
        const currentUser = await this.findOne(id)
        await this.userRepository.remove(currentUser)
    }
}
