import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateOrdersTable1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE order_status_enum AS ENUM ('Pendente', 'Concluído', 'Cancelado')`);

    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['Pendente', 'Concluído', 'Cancelado'],
            default: "'Pendente'",
          },
          {
            name: 'total_pedido',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'produtos',
            type: 'jsonb',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('orders');
    await queryRunner.query(`DROP TYPE order_status_enum`);
  }
}

