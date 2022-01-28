import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddIsDeletedColumnToUsersTable1640621378818 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            create type user_status
                as enum ('web3Only', 'emailPasswordEnabled', 'deleted')
        `)

        await queryRunner.query(`
            alter table users add status user_status default null;
            update users set status = 'emailPasswordEnabled' where "isEmailPasswordEnabled" is true;
            update users set status = 'web3Only' where "isEmailPasswordEnabled" is false;
            alter table users drop column "isEmailPasswordEnabled";
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'users',
            new TableColumn({
                name: 'isEmailPasswordEnabled',
                type: 'boolean',
                isNullable: false,
                default: 'false',
            }),
        )

        await queryRunner.query(
            `update users set "isEmailPasswordEnabled" = true where status = 'emailPasswordEnabled'`,
        )

        await queryRunner.query(`
            alter table "users" drop column "status";
        `)

        await queryRunner.query(`
            drop type user_status;
        `)
    }
}
