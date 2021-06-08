import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddStatusToIdea1610786062911 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            create type idea_status 
                as enum ('draft', 'active', 'turned_into_proposal', 'closed')
        `)
        await queryRunner.query(`
            alter table ideas add status idea_status default 'draft' not null;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            alter table ideas drop column status;
        `)
        await queryRunner.query(`
            drop type idea_status;
        `)
    }
}
