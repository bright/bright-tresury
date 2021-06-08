import { MigrationInterface, QueryRunner } from 'typeorm'

export class ChangeIdeaValueType1607372348529 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        alter table "idea_networks" drop column "value";
        alter table "idea_networks" add column "value" decimal(39, 15) not null default 0;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        alter table "idea_networks" drop column "value";
        alter table "idea_networks" add column "value" integer not null default 0;
        `)
    }
}
