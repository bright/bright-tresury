import { MigrationInterface, QueryRunner } from 'typeorm'

export class RemoveColumnsFromBountiesTable1639424432622 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            alter table "bounties" 
            drop column "blockchainDescription",
            drop column "value",
            drop column "proposer"
         `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            alter table "bounties" 
            add column "blockchainDescription" text,
            add column "value" DECIMAL(54,0) default 0,  
            add column "proposer" text`)
    }
}
