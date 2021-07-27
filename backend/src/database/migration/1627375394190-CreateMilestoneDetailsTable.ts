import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateMilestoneDetailsTable1627375394190 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            create table "milestone_details" (
              "id" uuid primary key,
              "createdAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
              "updatedAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
              "subject" text not null,
              "dateFrom" date null,
              "dateTo" date null,
              "description" text null
            );          
         `)

        await queryRunner.query(`
            insert into "milestone_details" select
              "id",
              "createdAt",
              "updatedAt",
              "subject",
              "dateFrom",
              "dateTo",
              "description"
              from idea_milestones
         `)

        await queryRunner.query(`
            alter table "idea_milestones" add column "detailsId" uuid references "milestone_details" (id) ON DELETE CASCADE ON UPDATE CASCADE;
         `)

        await queryRunner.query(`
            update "idea_milestones" set "detailsId" = id
        `)

        await queryRunner.query(`
            alter table "idea_milestones"
            drop column "subject",
            drop column "dateFrom",
            drop column "dateTo",
            drop column "description";
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            alter table "idea_milestones" 
              add "subject" text null,
              add "dateFrom" date null,
              add "dateTo" date null,
              add "description" text null
         `)

        await queryRunner.query(`
            update "idea_milestones" set (subject, "dateFrom", "dateTo", description) = 
                (select subject, "dateFrom", "dateTo", description 
                 from "milestone_details"
                 where "milestone_details".id = "idea_milestones"."detailsId")
         `)

        await queryRunner.query(`
            alter table "idea_milestones" 
              alter column "subject" set not null
        `)

        await queryRunner.query(`
            alter table "idea_milestones" drop column "detailsId"
        `)
        await queryRunner.query(`
            drop table "milestone_details";
        `)
    }
}
