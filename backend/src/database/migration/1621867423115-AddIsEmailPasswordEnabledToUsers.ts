import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddIsEmailPasswordEnabledToUsers1621867423115 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'users',
            new TableColumn({
                name: 'isEmailPasswordEnabled',
                type: 'boolean',
                isNullable: false,
                default: 'false',
            }),
        )
        /*
         For users with disabled email-password account we have a random uuid in `email` column
         For users with enable email-password account we have a valid email in `email` column
         */
        await queryRunner.query(`update users set "isEmailPasswordEnabled" = true where email like '%@%;'`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users', 'isEmailPasswordEnabled')
    }
}
