import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddFieldContactPortfolioLinksToIdea1606391950764 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            alter table ideas 
                add portfolio text default null,
                add links text default null,
                add contact text default null,
                add "field" varchar(255) default null;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            alter table ideas 
                drop column portfolio, 
                drop column links,
                drop column contact,
                drop column "field";
        `)
    }
}
