import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddBeneficiaryToBountiesTable1637687432260 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            alter table "bounties" add column "beneficiary" text
         `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`alter table "bounties" drop column "beneficiary"`)
    }
}
