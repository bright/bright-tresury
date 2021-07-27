import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateProposals1627031249109 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            create table "proposals" (
              "id" uuid primary key,
              "createdAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
              "updatedAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
              "detailsId" uuid not null references "idea_proposal_details" (id) ON DELETE CASCADE ON UPDATE CASCADE,
              "ownerId" uuid REFERENCES users (id),
              "ideaNetworkId" uuid REFERENCES "idea_networks" (id),
              "networkId" text not null,
              "blockchainProposalId" integer not null
            );          
         `)

        await queryRunner.query(`
            insert into "idea_proposal_details" select
              "idea_networks"."id" as "id",
              "idea_proposal_details"."createdAt",
              "idea_proposal_details"."updatedAt",
              "idea_proposal_details"."title",
              "idea_proposal_details"."content",
              "idea_proposal_details"."portfolio",
              "idea_proposal_details"."links",
              "idea_proposal_details"."contact",
              "idea_proposal_details"."field"
              from "idea_networks"
              inner join "ideas" on "idea_networks"."ideaId" = "ideas"."id"
              inner join "idea_proposal_details" on "ideas"."detailsId" = "idea_proposal_details".id
              where "idea_networks"."blockchainProposalId" is not null
         `)

        await queryRunner.query(`
            insert into "proposals" select
              "idea_networks"."id" as "id",
              "idea_networks"."createdAt" as "createdAt",
              "idea_networks"."updatedAt" as "updatedAt",
              "idea_networks"."id" as "detailsId",
              "ideas"."ownerId" as "ownerId",
              "idea_networks"."id" as "ideaNetworkId",
              "idea_networks"."name" as "networkId",
              "idea_networks"."blockchainProposalId" as "blockchainProposalId"
              from "idea_networks"
              inner join "ideas" on "idea_networks"."ideaId" = "ideas"."id"
              where "idea_networks"."blockchainProposalId" is not null
         `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            delete from "idea_proposal_details" where id in (select "detailsId" from proposals);
        `)
        await queryRunner.query(`
            drop table "proposals";
        `)
    }
}
