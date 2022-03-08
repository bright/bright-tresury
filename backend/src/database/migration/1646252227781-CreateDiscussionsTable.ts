import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateDiscussionsTable1646252227781 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // create discussion table
        await queryRunner.query(`
            create type discussion_category 
                as enum ('bounty', 'proposal', 'idea')
        `)
        await queryRunner.query(`
            create table "discussions" (
              "id" uuid primary key,
              "createdAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
              "updatedAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
              "blockchainIndex" integer,
              "networkId" text,
              "entityId" uuid,
              "category" discussion_category not null
            );
        `)

        // add nullable relation to comments table
        await queryRunner.query(`
          alter table comments add column "discussionId" uuid references discussions (id) ON DELETE CASCADE ON UPDATE CASCADE
        `)

        // create discussions for each proposal, bounty and idea that have any comments and fill in comments.discussionId
        await queryRunner.query(`
          insert into discussions  (select distinct on ("networkId", "blockchainProposalId") pc.id, c."createdAt", c."createdAt", "blockchainProposalId", "networkId", null, 'proposal' from proposal_comments pc inner join comments c on c.id = pc."commentId");
          update comments
            set "discussionId" = d.id
            from discussions d
                     inner join proposal_comments pc
                                on d."networkId" = pc."networkId" and d."blockchainIndex" = pc."blockchainProposalId"
            where d.category = 'proposal'
              and comments.id = pc."commentId";

          insert into discussions  (select distinct on ("networkId", "blockchainBountyId") pc.id, c."createdAt", c."createdAt", "blockchainBountyId", "networkId", null, 'bounty' from bounty_comments pc inner join comments c on c.id = pc."commentId");
          update comments
            set "discussionId" = d.id
            from discussions d
                     inner join bounty_comments bc
                                on d."networkId" = bc."networkId" and d."blockchainIndex" = bc."blockchainBountyId"
            where d.category = 'bounty'
              and comments.id = bc."commentId";

          insert into discussions  (select distinct on ("ideaId") pc.id, c."createdAt", c."createdAt", null, null, "ideaId", 'idea' from idea_comments pc inner join comments c on c.id = pc."commentId");
          update comments
            set "discussionId" = d.id
            from discussions d
                     inner join idea_comments ic
                                on d."entityId" = ic."ideaId"
            where d.category = 'idea'
              and comments.id = ic."commentId";
        `)

        // make relation between comments and discussions not null
        await queryRunner.query(`
          alter table comments alter column "discussionId" set not null
        `)

        // remove old tables
        await queryRunner.query(`
          drop table idea_comments;
          drop table bounty_comments;
          drop table proposal_comments;
          
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // create table for each type of comments
        await queryRunner.query(`
        create table "proposal_comments" (
              "id" uuid primary key,
              "networkId" text not null,
              "blockchainProposalId" integer not null,
              "commentId" uuid not null references "comments" (id) on delete cascade on update cascade
            );

            create table idea_comments (
                id uuid not null primary key,
                "ideaId" uuid not null references ideas on update cascade on delete cascade,
                "commentId" uuid references comments on update cascade on delete cascade
            );

            create table "bounty_comments" (
              "id" uuid primary key,
              "networkId" text not null,
              "blockchainBountyId" integer not null,
              "commentId" uuid not null references "comments" (id) on delete cascade on update cascade
            );
        `)

        // copy data back to the tables
        await queryRunner.query(`
        insert into proposal_comments (select c.id, d."networkId", d."blockchainIndex", c.id from comments c inner join discussions d on c."discussionId" = d.id where d.category = 'proposal');
        insert into bounty_comments (select c.id, d."networkId", d."blockchainIndex", c.id from comments c inner join discussions d on c."discussionId" = d.id where d.category = 'bounty');
        insert into idea_comments (select c.id, d."entityId", c.id from comments c inner join discussions d on c."discussionId" = d.id where d.category = 'idea');
        `)

        await queryRunner.query(`
            alter table comments drop column "discussionId";
            drop table "discussions";
            drop type discussion_category;
        `)
    }
}
