import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateTipEntity1649342017112 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            create table "tips" (
              "id" uuid primary key,
              "createdAt" timestamp with time zone not null default CURRENT_TIMESTAMP,
              "updatedAt" timestamp with time zone not null default CURRENT_TIMESTAMP,
              "networkId" text not null,
              "blockchainHash" text not null,
              "title" text not null,
              "description" text,
              "ownerId" uuid REFERENCES users (id)
            );          
         `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            drop table "tips"
        `)
    }
}
