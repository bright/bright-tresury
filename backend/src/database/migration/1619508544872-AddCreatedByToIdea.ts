import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCreatedByToIdea1619508544872 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        alter table "ideas" add column "ownerId" uuid REFERENCES users (id);
        `)
        await queryRunner.query(`
        update "ideas" set "ownerId" = (select id from users limit 1);
        `)
        await queryRunner.query(`
        alter table "ideas" alter column "ownerId" set not null;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            alter table "ideas" drop column "ownerId";
        `)
    }

}
