import {DatabaseModule} from "../database/database.module";
import {User} from "./user.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersService} from "./users.service";
import {Module} from "@nestjs/common";

@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([User])],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule {
}
