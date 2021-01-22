import {MigrationInterface, QueryRunner} from "typeorm";

export class AddOrdinalNumberToIdea1611308671218 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            alter table ideas add "ordinalNumber" serial not null;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            alter table ideas drop column "ordinalNumber";
        `)
    }

}
