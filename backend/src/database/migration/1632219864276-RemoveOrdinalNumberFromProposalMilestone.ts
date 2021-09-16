import { MigrationInterface, QueryRunner } from 'typeorm'

export class RemoveOrdinalNumberFromProposalMilestone1632219864276 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            alter table "proposal_milestones" drop column "ordinalNumber";
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // postgres will put auto-incremented values in the new column
        await queryRunner.query(`
            alter table "proposal_milestones" add column "ordinalNumber" serial not null;
        `)
    }
}
