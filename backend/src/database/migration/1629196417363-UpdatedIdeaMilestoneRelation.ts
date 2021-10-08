import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdatedIdeaMilestoneRelation1629196417363 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            alter table "idea_milestones" DROP CONSTRAINT "idea_milestones_detailsId_fkey",
            ADD CONSTRAINT "idea_milestones_detailsId_fkey"
            FOREIGN KEY ("detailsId")
            REFERENCES "milestone_details"(id);
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            alter table "idea_milestones" DROP CONSTRAINT "idea_milestones_detailsId_fkey",
            ADD CONSTRAINT "idea_milestones_detailsId_fkey"
            FOREIGN KEY ("detailsId")
            REFERENCES "milestone_details"(id)
            ON UPDATE CASCADE ON DELETE CASCADE;
        `)
    }
}
