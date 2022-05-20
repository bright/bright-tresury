import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateChildBountiesTable1653311983426 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            create table "child_bounties" (
              "id" uuid primary key,
              "createdAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
              "updatedAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
              "title" text not null,
              "description" text,
              "networkId" text not null,
              "blockchainIndex" integer,
              "parentBountyBlockchainIndex" integer,
              "ownerId" uuid REFERENCES users (id)
            );          
         `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`drop table child_bounties`)
    }
}
