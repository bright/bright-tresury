import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateBountyCommentsTable1638303849551 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            create table "bounty_comments" (
              "id" uuid primary key,
              "networkId" text not null,
              "blockchainBountyId" integer not null,
              "commentId" uuid not null references "comments" (id) on delete cascade on update cascade
            );          
         `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            drop table "bounty_comments";
        `)
    }
}
