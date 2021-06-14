import { MigrationInterface, QueryRunner } from 'typeorm'

export class ChangeMilestoneOrdinalNumberType1623694289984 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            alter table idea_milestones alter column "ordinalNumber" DROP DEFAULT;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            alter table idea_milestones add column "ordinalNumberNew" serial not null;
            update idea_milestones set "ordinalNumberNew" = "ordinalNumber";
            alter table idea_milestones drop column "ordinalNumber";
            alter table idea_milestones rename column "ordinalNumberNew" to "ordinalNumber";
        `)
    }
}
