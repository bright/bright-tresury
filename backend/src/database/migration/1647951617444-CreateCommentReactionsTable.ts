import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateCommentReactionsTable1647951617444 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            create table "comment_reactions" (
              "id" uuid primary key,
              "createdAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
              "updatedAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
              "name" text not null,
              "authorId" uuid references users (id),
              "commentId" uuid references comments (id) ON DELETE CASCADE ON UPDATE CASCADE
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            drop table "comment_reactions"
        `)
    }
}
