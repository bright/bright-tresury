import {MigrationInterface, QueryRunner} from "typeorm";

export class AddExtrinsicAndProposalIdToIdeaNetwork1605701873474 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        alter table "idea_networks" add column "blockchainProposalId" integer null;
        alter table "idea_networks" add column "extrinsicId" uuid REFERENCES extrinsics (id);
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        alter table "idea_networks" drop column "extrinsicId";
        alter table "idea_networks" drop column "blockchainProposalId";
        `)
    }

}
