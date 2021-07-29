import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddMilestoneNetworkIdToIdeaProposalDetailsTable1627549210515 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            alter table "proposals"
             alter column "ideaNetworkId" DROP NOT NULL,
             add column "ideaMilestoneNetworkId" uuid REFERENCES "idea_milestone_networks" (id);
         `)

        await queryRunner.query(`
            insert into "idea_proposal_details" select
              "idea_milestone_networks"."id" as "id",
              "milestone_details"."createdAt",
              "milestone_details"."updatedAt",
              concat("idea_proposal_details"."title", ' - ', "milestone_details"."subject") as "title",
              concat("idea_proposal_details"."content",chr(13), 'Dates: ', "milestone_details"."dateFrom", ' - ', "milestone_details"."dateTo", chr(13),'Description: ', "milestone_details"."description") as "content",
              "idea_proposal_details"."portfolio",
              "idea_proposal_details"."links",
              "idea_proposal_details"."contact",
              "idea_proposal_details"."field"
              from "idea_milestone_networks"
              inner join "idea_milestones" on "idea_milestone_networks"."ideaMilestoneId" = "idea_milestones"."id"
              inner join "milestone_details" on "idea_milestones"."detailsId" = "milestone_details".id
              inner join "ideas" on "idea_milestones"."ideaId" = "ideas"."id"
              inner join "idea_proposal_details" on "ideas"."detailsId" = "idea_proposal_details".id
         `)

        await queryRunner.query(`
            insert into "proposals" select
              "idea_milestone_networks"."id" as "id",
              "idea_milestone_networks"."createdAt" as "createdAt",
              "idea_milestone_networks"."updatedAt" as "updatedAt",
              "idea_milestone_networks"."id" as "detailsId",
              "ideas"."ownerId" as "ownerId",
                               null as "ideaNetworkId",
              "idea_milestone_networks"."name" as "networkId",
              "idea_milestone_networks"."blockchainProposalId" as "blockchainProposalId",
              "idea_milestone_networks"."id" as "ideaMilestoneNetworkId"
              from "idea_milestone_networks"
              inner join "idea_milestones" on "idea_milestone_networks"."ideaMilestoneId" = "idea_milestones"."id"
              inner join "ideas" on "idea_milestones"."ideaId" = "ideas"."id"
              where "idea_milestone_networks"."blockchainProposalId" is not null
         `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            delete from "proposals" where "ideaNetworkId" is null;
        `)

        await queryRunner.query(`
            alter table "proposals" 
             alter column "ideaNetworkId" set not null,
             drop column "ideaMilestoneNetworkId"; 
        `)
    }
}
