import {MigrationInterface, QueryRunner} from "typeorm";

export class AddExtrinsicAndBlockchainProposalIdToIdeaMilestoneNetwork1619508544874 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        alter table "idea_milestone_networks" add column "blockchainProposalId" integer null;
        alter table "idea_milestone_networks" add column "extrinsicId" uuid REFERENCES extrinsics (id);
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        alter table "idea_milestone_networks" drop column "extrinsicId";
        alter table "idea_milestone_networks" drop column "blockchainProposalId";
        `)
    }

}
