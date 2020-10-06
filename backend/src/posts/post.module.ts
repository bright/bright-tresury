import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseModule } from "../database/database.module";
import { Post } from "./post.entity";


@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([Post])]
})
export class PostModule {
}
