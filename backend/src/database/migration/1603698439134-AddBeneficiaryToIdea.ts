import {MigrationInterface, QueryRunner} from "typeorm";

export class AddBeneficiaryToIdea1603698439134 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        alter table "ideas" add column "beneficiary" text null;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        alter table "ideas" drop column "beneficiary";
        `)
    }

}
