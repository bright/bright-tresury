import {Module} from "@nestjs/common";
import {BlockchainAddress} from "./blockchainAddress.entity";
import {DatabaseModule} from "../../database/database.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {BlockchainAddressService} from "./blockchainAddress.service";
import {User} from "../user.entity";

@Module({
    imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([User, BlockchainAddress]),
    ],
    providers: [BlockchainAddressService],
    exports: [BlockchainAddressService]
})
export class BlockchainAddressModule {
}
