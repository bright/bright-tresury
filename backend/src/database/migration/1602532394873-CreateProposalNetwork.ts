import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateProposalNetwork1602532394873 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        create table "proposal_networks" (
          "id" uuid primary key,
          "createdAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
          "updatedAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
          "name" text not null,
          "value" integer not null,
          "proposalId" uuid REFERENCES proposals (id)
        )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        drop table "proposal_networks";
        `)
    }
}
