import { MigrationInterface, QueryRunner } from 'typeorm'

export class IdeaNetworksForeignKeyChangedToCascade1606750513669 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE idea_networks
                drop CONSTRAINT "idea_networks_ideaId_fkey";
        `)
        await queryRunner.query(`
            ALTER TABLE idea_networks
                ADD CONSTRAINT "idea_networks_ideaId_fkey"
                FOREIGN KEY ("ideaId")
                REFERENCES ideas (id)
                ON DELETE CASCADE ON UPDATE CASCADE;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE idea_networks
                drop CONSTRAINT idea_networks_ideaId_fkey;  
        `)
        await queryRunner.query(`
            ALTER TABLE idea_networks
                ADD CONSTRAINT idea_networks_ideaId_fkey
                FOREIGN KEY ("ideaId")
                REFERENCES ideas (id)
                ON DELETE NO ACTION ON UPDATE NO ACTION;
        `)
    }
}
