import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddBlockchainAddressToUserTable1615018421825 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            alter table users alter column email drop not null;

            alter table users add "blockchainAddress" text;

            create unique index users_blockchainaddress_uindex on users ("blockchainAddress");
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            alter table users alter column email set not null;

            drop index users_blockchainaddress_uindex;

            alter table users drop column "blockchainAddress";
        `)
    }
}
