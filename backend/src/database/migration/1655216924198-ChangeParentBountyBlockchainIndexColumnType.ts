import { MigrationInterface, QueryRunner } from 'typeorm'

export class ChangeParentBountyBlockchainIndexColumnType1655216924198 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
         ALTER TABLE "discussions" ALTER COLUMN "parentBountyBlockchainIndex" type integer USING ("parentBountyBlockchainIndex"::integer);
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
         ALTER TABLE "discussions" ALTER COLUMN "parentBountyBlockchainIndex" type text USING ("parentBountyBlockchainIndex"::text);
        `)
    }
}
