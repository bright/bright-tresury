import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateUserTable1613200924319 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            create table users (
                id uuid primary key,
                "authId" uuid not null,
                username varchar(255) not null,
                email varchar(255) not null,
                "createdAt" timestamp with time zone not null default CURRENT_TIMESTAMP ,
                "updatedAt" timestamp with time zone not null default CURRENT_TIMESTAMP
            );
            
            create unique index users_email_uindex on users (email);
            
            create unique index users_authid_uindex on users ("authId");
            
            create unique index users_username_uindex on users (username);
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            drop table "users";
        `)
    }
}
