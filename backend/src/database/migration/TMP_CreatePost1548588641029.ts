import { MigrationInterface, QueryRunner } from "typeorm";

export class TMP_CreatePost1548588641029 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        create table "posts" (
          "id" uuid primary key,
          "createdAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
          "updatedAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
          "title" text not null,
          "content" text null
        )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        drop table "posts";
        `)
    }

}
