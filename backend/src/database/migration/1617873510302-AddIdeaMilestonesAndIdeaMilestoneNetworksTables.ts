import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddIdeaMilestonesAndIdeaMilestoneNetworksTables1617873510302 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            create table "idea_milestones" (
              "id" uuid primary key,
              "createdAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
              "updatedAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
              "ordinalNumber" serial not null,
              "subject" text not null,
              "dateFrom" date null,
              "dateTo" date null,
              "description" text null,
              "ideaId" uuid REFERENCES ideas (id) ON DELETE CASCADE ON UPDATE CASCADE
            )
        `)

        await queryRunner.query(`
            create table "idea_milestone_networks" (
              "id" uuid primary key,
              "createdAt" timestamp with time zone not null default CURRENT_TIMESTAMP,
              "updatedAt" timestamp with time zone not null default CURRENT_TIMESTAMP,
              "name" text not null,
              "value" decimal(39, 15) not null default 0,
              "ideaMilestoneId" uuid REFERENCES idea_milestones (id) ON DELETE CASCADE ON UPDATE CASCADE
            )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`drop table "idea_milestone_networks"`)
        await queryRunner.query(`drop table "idea_milestones"`)
    }
}
