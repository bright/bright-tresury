import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateIdeaStatusTypeAndAddStatusToIdeaMilestoneTable1619508544873 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        await queryRunner.query(`
            alter type idea_status rename to idea_status_old;
            
            create type idea_status as enum ('draft', 'active', 'turned_into_proposal', 'turned_into_proposal_by_milestone', 'closed');
            
            alter table ideas alter column status drop default;
           
            alter table ideas alter column status type idea_status using status::text::idea_status;
            
            alter table ideas alter column status set default 'draft';
            
            drop type idea_status_old;
        `)

        await queryRunner.query(`
            create type idea_milestone_status as enum ('active', 'turned_into_proposal')
        `)

        await queryRunner.query(`
            alter table idea_milestones add status idea_milestone_status default 'active' not null
        `)

    }

    public async down(queryRunner: QueryRunner): Promise<any> {

        await queryRunner.query(`
            update ideas set status = 'turned_into_proposal' where status = 'turned_into_proposal_by_milestone'
        `)

        await queryRunner.query(`
            alter type idea_status rename to idea_status_old;
            
            create type idea_status as enum ('draft', 'active', 'turned_into_proposal', 'closed');
            
            alter table ideas alter column status drop default;
           
            alter table ideas alter column status type idea_status using status::text::idea_status;
            
            alter table ideas alter column status set default 'draft';
            
            drop type idea_status_old;
        `)

        await queryRunner.query(`
            alter table idea_milestones drop column status;
        `)

        await queryRunner.query(`
            drop type idea_milestone_status;
        `)
    }

}
