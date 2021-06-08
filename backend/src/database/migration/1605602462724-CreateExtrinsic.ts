import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateExtrinsic1605602462724 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        create table "extrinsics" (
          "id" uuid primary key,
          "createdAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
          "updatedAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
          "extrinsicHash" text not null,
          "lastBlockHash" text not null,
          "status" text not null,
          "data" json not null,
          "blockHash" text null,
          "events" json null
        )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        drop table "extrinsics";
        `)
    }
}
