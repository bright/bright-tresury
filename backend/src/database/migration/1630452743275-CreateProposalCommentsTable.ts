import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateProposalCommentsTable1630452743275 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            create table "proposal_comments" (
              "id" uuid primary key,
              "networkId" text not null,
              "blockchainProposalId" integer not null,
              "commentId" uuid not null references "comments" (id) on delete cascade on update cascade
            );          
         `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            drop table "proposal_comments";
        `)
    }
}
