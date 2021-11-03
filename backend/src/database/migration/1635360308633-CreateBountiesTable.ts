import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateBountiesTable1635360308633 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            create table "bounties" (
              "id" uuid primary key,
              "createdAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
              "updatedAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
              "blockchainDescription" text not null,
              "value" DECIMAL(54,0) not null default 0,
              "title" text not null,
              "field" text,
              "description" text,
              "networkId" text not null,
              "proposer" text not null,
              "blockchainIndex" integer,
              "ownerId" uuid REFERENCES users (id)
            );          
         `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`drop table bounties`)
    }
}
