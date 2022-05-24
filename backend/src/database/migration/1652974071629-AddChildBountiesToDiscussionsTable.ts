import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddChildBountiesToDiscussionsTable1652974071629 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // postgres does not support adding/removing values from an enum inside transactions'
        await queryRunner.query(`
            alter table "discussions" alter column "category" type text;
            drop type discussion_category;
            create type discussion_category 
                as enum ('bounty', 'proposal', 'idea', 'tip', 'childBounty');
            alter table "discussions" alter column "category" type discussion_category USING (category::discussion_category);
        `)
        await queryRunner.query(`
            alter table "discussions" add column "parentBountyBlockchainIndex" text
         `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            alter table "discussions" drop column "parentBountyBlockchainIndex"
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
