import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddIdeaNetworkStatus1628764102784 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            create type idea_network_status as enum ('active', 'pending', 'turned_into_proposal')
        `)

        await queryRunner.query(`
            alter table idea_networks add status idea_network_status default 'active' not null
        `)

        await queryRunner.query(`
            update idea_networks set status = 'turned_into_proposal' where "blockchainProposalId" is not null;
            update idea_networks set status = 'pending' where "ideaId" in (select id from ideas where status = 'turned_into_proposal') and "blockchainProposalId" is null;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            alter table idea_networks drop column status;
        `)

        await queryRunner.query(`
            drop type idea_network_status;
        `)
    }
}
