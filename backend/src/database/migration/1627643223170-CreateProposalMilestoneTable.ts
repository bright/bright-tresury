import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateProposalMilestoneTable1627643223170 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            create table "proposal_milestones" (
              "id" uuid primary key,
              "createdAt" timestamp with time zone not null default CURRENT_TIMESTAMP,
              "updatedAt" timestamp with time zone not null default CURRENT_TIMESTAMP,
              "ordinalNumber" serial not null,
              "proposalId" uuid REFERENCES proposals (id) ON DELETE CASCADE ON UPDATE CASCADE,
              "detailsId" uuid references "milestone_details" (id) ON DELETE CASCADE ON UPDATE CASCADE
            )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`drop table "proposal_milestones"`)
    }
}
