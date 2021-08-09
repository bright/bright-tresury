import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateIdeaCommentTable1628250589412 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            create table "idea_comments" (
              "id" uuid primary key,
              "createdAt" timestamp with time zone not null default CURRENT_TIMESTAMP,
              "updatedAt" timestamp with time zone not null default CURRENT_TIMESTAMP,
              "ideaId" uuid not null references "ideas" (id) on delete cascade on update cascade,
              "authorId" uuid not null references "users" (id),
              "content" text not null,
              "thumbsUp" integer not null default 0,
              "thumbsDown" integer not null default 0
            );          
         `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            drop table "idea_comments";
        `)
    }
}
