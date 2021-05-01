import {DatabaseModule} from "../database/database.module";
import {User} from "./user.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersService} from "./users.service";
import {Module} from "@nestjs/common";
import {BlockchainAddress} from "./blockchainAddress/blockchainAddress.entity";
import {BlockchainAddressModule} from "./blockchainAddress/blockchainAddress.module";

@Module({
    imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([User, BlockchainAddress]),
        BlockchainAddressModule
    ],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule {
}
