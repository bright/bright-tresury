import { MigrationInterface, QueryRunner } from 'typeorm'

export class RemoveOrdinalNumberFromIdeaMilestone1635160241601 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            alter table "idea_milestones" drop column "ordinalNumber";
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // postgres will put auto-incremented values in the new column
        await queryRunner.query(`
            alter table "idea_milestones" add column "ordinalNumber" serial not null;
        `)
    }
}
