import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateSignInAttemptTable1644227780729 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            create table "sign_in_attempt" (
              "id" uuid primary key,
              "createdAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
              "updatedAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
              "userId" uuid not null REFERENCES users (id),
              "count" integer not null default 0,
              "attemptedAt" timestamp with time zone null
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            drop table "sign_in_attempt";
        `)
    }

}
