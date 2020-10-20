import {MigrationInterface, QueryRunner} from "typeorm";

export class RenameProposalToIdea1603134241443 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        drop table "proposal_networks";
        `)
        await queryRunner.query(`
        drop table "proposals";
        `)
        await queryRunner.query(`
        create table "ideas" (
          "id" uuid primary key,
          "createdAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
          "updatedAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
          "title" text not null,
          "content" text null
        )
        `)
        await queryRunner.query(`
        create table "idea_networks" (
          "id" uuid primary key,
          "createdAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
          "updatedAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
          "name" text not null,
          "value" integer not null,
          "ideaId" uuid REFERENCES ideas (id)
        )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        drop table "idea_networks";
        `)
        await queryRunner.query(`
        drop table "ideas";
        `)
        await queryRunner.query(`
        create table "proposals" (
          "id" uuid primary key,
          "createdAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
          "updatedAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
          "title" text not null,
          "content" text null
        )
        `)
        await queryRunner.query(`
        create table "proposal_networks" (
          "id" uuid primary key,
          "createdAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
          "updatedAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
          "name" text not null,
          "value" integer not null,
          "proposalId" uuid REFERENCES proposals (id)
        )
        `)
    }

}
