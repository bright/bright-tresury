import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class MakeEmailInUsersTableNotNull1621872198266 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            update users set email = username where email is null;
            alter table users alter column email set not null;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            alter table users alter column email drop not null;
        `)
    }

}
