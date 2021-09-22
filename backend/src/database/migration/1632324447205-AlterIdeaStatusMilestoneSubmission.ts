import { MigrationInterface, QueryRunner } from 'typeorm'

export class AlterIdeaStatusMilestoneSubmission1632324447205 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // create new type idea_status with old turned_into_proposal_by_milestone and new milestone_submission
        await queryRunner.query(`
             alter type idea_status rename to idea_status_old;
             create type idea_status as enum ('draft', 'active', 'turned_into_proposal', 'turned_into_proposal_by_milestone', 'milestone_submission', 'closed');
             alter table ideas alter column status drop default;
             alter table ideas alter column status type idea_status using status::text::idea_status;
             drop type idea_status_old
        `)
        // replace turned_into_proposal_by_milestone with milestone_submission
        await queryRunner.query(`
            update ideas set status='milestone_submission' where status='turned_into_proposal_by_milestone';
        `)
        // create new type idea_status with new milestone_submission only
        await queryRunner.query(`
            alter type idea_status rename to idea_status_old;
            create type idea_status as enum ('draft', 'active', 'turned_into_proposal', 'milestone_submission', 'closed');
            alter table ideas alter column status drop default;
            alter table ideas alter column status type idea_status using status::text::idea_status;
            alter table ideas alter column status set default 'draft';
            drop type idea_status_old
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
             alter type idea_status rename to idea_status_old;
             create type idea_status as enum ('draft', 'active', 'turned_into_proposal', 'turned_into_proposal_by_milestone', 'milestone_submission', 'closed');
             alter table ideas alter column status drop default;
             alter table ideas alter column status type idea_status using status::text::idea_status;
             drop type idea_status_old
        `)
        await queryRunner.query(`
            update ideas set status='turned_into_proposal_by_milestone' where status='milestone_submission';
        `)
        await queryRunner.query(`
            alter type idea_status rename to idea_status_old;
            create type idea_status as enum ('draft', 'active', 'turned_into_proposal', 'turned_into_proposal_by_milestone', 'closed');
            alter table ideas alter column status drop default;
            alter table ideas alter column status type idea_status using status::text::idea_status;
            alter table ideas alter column status set default 'draft';
            drop type idea_status_old
        `)
    }
}
