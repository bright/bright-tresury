import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddBlockchainAddressUserJoinTable1619793872439 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`alter table users drop column "blockchainAddress"`)
        await queryRunner.query(`
            create table user_blockchain_address
            (
                "id" uuid primary key,
                "createdAt" timestamp with time zone not null default CURRENT_TIMESTAMP,
                "updatedAt" timestamp with time zone not null default CURRENT_TIMESTAMP,
                "userId" uuid not null
                constraint user_blockchain_address_users_id_fk
                references users
                on update cascade on delete cascade,
                address text not null,
                "isPrimary" boolean default false
            );
            create unique index user_blockchain_address_address_uindex on user_blockchain_address (address);
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`alter table users add "blockchainAddress" text;`)
        await queryRunner.query('drop table user_blockchain_address;')
    }
}
