import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddIsEmailNotificationEnabledToUsersTable1634125727843 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'users',
            new TableColumn({
                name: 'isEmailNotificationEnabled',
                type: 'boolean',
                isNullable: false,
                default: 'false',
            }),
        )
        await queryRunner.query(`update users set "isEmailNotificationEnabled" = true`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users', 'isEmailNotificationEnabled')
    }
}
