import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateIdeaProposalDetailsTable1625825504921 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            create table "idea_proposal_details" (
              "id" uuid primary key,
              "createdAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
              "updatedAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
              "title" text not null,
              "content" text null,
              "portfolio" text default null,
              "links" text default null,
              "contact" text default null,
              "field" varchar(255) default null
            );          
         `)

        await queryRunner.query(`
            insert into "idea_proposal_details" select
              "id",
              "createdAt",
              "updatedAt",
              "title",
              "content",
              "portfolio",
              "links",
              "contact",
              "field"
              from ideas
         `)

        await queryRunner.query(`
            alter table "ideas" add column "detailsId" uuid references "idea_proposal_details" (id) ON DELETE CASCADE ON UPDATE CASCADE;
         `)

        await queryRunner.query(`
            update "ideas" set "detailsId" = id
        `)

        await queryRunner.query(`
            alter table ideas
            drop column "portfolio",
            drop column "links",
            drop column "contact",
            drop column "field",
            drop column "title",
            drop column "content";
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            alter table "ideas" 
              add "title" text null,
              add "content" text null,
              add "portfolio" text default null,
              add "links" text default null,
              add "contact" text default null,
              add "field" varchar(255) default null;
         `)

        await queryRunner.query(`
            update "ideas" set (title, content, portfolio, links, contact, field) = 
                (select title, content, portfolio, links, contact, field 
                 from "idea_proposal_details"
                 where "idea_proposal_details".id = "ideas"."detailsId")
         `)

        await queryRunner.query(`
            alter table "ideas" 
              alter column "title" set not null
        `)

        await queryRunner.query(`
            alter table "ideas" drop column "detailsId"
        `)
        await queryRunner.query(`
            drop table "idea_proposal_details";
        `)
    }
}
