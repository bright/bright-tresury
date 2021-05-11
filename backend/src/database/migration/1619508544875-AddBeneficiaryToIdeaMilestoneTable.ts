import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddBeneficiaryToIdeaMilestoneTable1619508544875 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn(
            'idea_milestones',
            new TableColumn({
                name: 'beneficiary',
                type: 'text',
                isNullable: true
            }))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('idea_milestones', 'beneficiary')
    }

}
