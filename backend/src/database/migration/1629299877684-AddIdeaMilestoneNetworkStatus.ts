import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddIdeaMilestoneNetworkStatus1629299877684 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            create type idea_milestone_network_status as enum ('active', 'pending', 'turned_into_proposal')
        `)

        await queryRunner.query(`
            alter table idea_milestone_networks add status idea_milestone_network_status default 'active' not null
        `)

        await queryRunner.query(`
            update idea_milestone_networks set status = 'turned_into_proposal' where "blockchainProposalId" is not null;
            update idea_milestone_networks set status = 'pending' where "ideaMilestoneId" in (select id from idea_milestones where status = 'turned_into_proposal') and "blockchainProposalId" is null;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            alter table idea_milestone_networks drop column status;
        `)

        await queryRunner.query(`
            drop type idea_milestone_network_status;
        `)
    }
}
