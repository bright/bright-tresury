import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateAppEventTable1632478190011 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            create table "app_events" (
              "id" uuid primary key,
              "createdAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
              "updatedAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
              "data" json not null
            );
            create table "app_event_receivers" (
              "id" uuid primary key,
              "createdAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
              "updatedAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
              "appEventId" uuid not null REFERENCES "app_events" (id),
              "userId" uuid not null REFERENCES users (id),
              "isRead" boolean not null default false
            );
         `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            drop table "app_event_receivers";
            drop table "app_events";
         `)
    }
}
