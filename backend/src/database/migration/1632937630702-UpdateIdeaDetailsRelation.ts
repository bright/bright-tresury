import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateIdaDetailsRelation1629122631545 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            alter table "ideas" DROP CONSTRAINT "ideas_detailsId_fkey",
            ADD CONSTRAINT "ideas_detailsId_fkey"
            FOREIGN KEY ("detailsId")
            REFERENCES "idea_proposal_details"(id);         
         `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            alter table "ideas" DROP CONSTRAINT "ideas_detailsId_fkey",
            ADD CONSTRAINT "ideas_detailsId_fkey"
            FOREIGN KEY ("detailsId")
            REFERENCES "idea_proposal_details"(id)
            ON UPDATE CASCADE ON DELETE CASCADE;
         `)
    }
}
