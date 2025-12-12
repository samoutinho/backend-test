import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddImageColumnToProducts1700000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'imagem',
        type: 'varchar',
        length: 500,
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('products', 'imagem');
  }
}
