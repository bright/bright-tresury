import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddBlockchainHashToDiscussionsTable1649924750975 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // postgres does not support adding/removing values from an enum inside transactions'
        await queryRunner.query(`
            alter table "discussions" alter column "category" type text;
            drop type discussion_category;
            create type discussion_category 
                as enum ('bounty', 'proposal', 'idea', 'tip');
            alter table "discussions" alter column "category" type discussion_category USING (category::discussion_category);
        `)
        await queryRunner.query(`
            alter table "discussions" add column "blockchainHash" text
         `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            alter table "discussions" drop column "blockchainHash"
         `)
        await queryRunner.query(`
            alter table "discussions" alter column "category" type text;
            drop type discussion_category;
            create type discussion_category 
                as enum ('bounty', 'proposal', 'idea');
            alter table "discussions" alter column "category" type discussion_category USING (category::discussion_category);
        `)
    }
}
