import { MigrationInterface, QueryRunner } from 'typeorm'

export class ChangeColumnValuePrecision1633940504968 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        ALTER TABLE "idea_networks" ALTER COLUMN "value" TYPE DECIMAL(54,0);
        ALTER TABLE "idea_milestone_networks" ALTER COLUMN "value" TYPE DECIMAL(54,0);
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        ALTER TABLE "idea_networks" ALTER COLUMN "value" TYPE decimal(39,15);
        ALTER TABLE "idea_milestone_networks" ALTER COLUMN "value" TYPE decimal(39,15);
        `)
    }
}
