import { MigrationInterface, QueryRunner } from 'typeorm'

export class RenameBlockchainAddressToWeb31622268633205 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            alter table user_blockchain_address rename to user_web3_addresses;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            alter table user_web3_addresses rename to user_blockchain_address;
        `)
    }
}
