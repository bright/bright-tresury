import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateCommentTable1630328966803 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // create new table "comments" which will be shared by "idea_comments" and "proposal_comments"
        await queryRunner.query(`
            create table "comments" (
              "id" uuid primary key,
              "createdAt" timestamp with time zone not null default CURRENT_TIMESTAMP,
              "updatedAt" timestamp with time zone not null default CURRENT_TIMESTAMP,
              "authorId" uuid not null references "users" (id) on delete cascade on update cascade,
              "content" text not null,
              "thumbsUp" integer not null default 0,
              "thumbsDown" integer not null default 0
            );          
        `)

        // we need to copy existing data from previously made "idea_comments" to new "comments" table
        await queryRunner.query(`
            insert into "comments" select 
                "id",
                "createdAt",
                "updatedAt",
                "authorId",
                "content",
                "thumbsUp",
                "thumbsDown"
                from "idea_comments"
        `)

        // lets create new column in "idea_comments" that will reference a comment from "comments" table
        await queryRunner.query(
            `alter table "idea_comments" add column "commentId" uuid references "comments" (id) ON DELETE CASCADE ON UPDATE CASCADE`,
        )

        // since we copied data from "idea_comments" to "comments" we can set the commentId value from id
        await queryRunner.query(`
            update "idea_comments" set "commentId" = id
        `)

        // since we already copied the data to new table and set the required reference we are good to remove not needed columns from idea_comments table
        await queryRunner.query(`
            alter table "idea_comments"
            drop column "content",
            drop column "authorId",
            drop column "thumbsUp",
            drop column "thumbsDown",
            drop column "createdAt",
            drop column "updatedAt"
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // we need to restore dropped columns in "idea_comments" table (allowing null values for now only)
        await queryRunner.query(`
            alter table "idea_comments"
            add "content" text null,
            add "authorId" uuid null references "users" (id) on delete cascade on update cascade,
            add "thumbsUp" integer null,
            add "thumbsDown" integer null,
            add "createdAt" timestamp with time zone null default CURRENT_TIMESTAMP,
            add "updatedAt" timestamp with time zone null default CURRENT_TIMESTAMP,
        `)
        // copy back the values from "comments" table to "idea_comments" table
        await queryRunner.query(`
            update "idea_comments" set (content, "authorId", "thumbsUp", "thumbsDown", "createdAt", "updatedAt") = 
            (select content, "authorId", "thumbsUp", "thumbsDown", "createdAt", "updatedAt" 
             from "comments" 
             where "comments".id = "idea_comments"."commentId")
        `)
        // fix null constraint for restored columns
        await queryRunner.query(`
            alter table "idea_comments"
            alter column "content" set not null,
            alter column "authorId" set not null,
            alter column "thumbsUp" set not null,
            alter column "thumbsDown" set not null
            alter column "createdAt" set not null,
            alter column "updatedAt" set not null
        `)
        // since all the data is now copied back into idea_comments table we don't need the commentId column anymore
        await queryRunner.query(`
            alter table "idea_comments" drop column "commentId"
        `)
        // lastly we don't need comments table anymore
        await queryRunner.query(`
            drop table "comments";
        `)
    }
}
