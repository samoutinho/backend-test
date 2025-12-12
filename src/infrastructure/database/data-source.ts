import { DataSource } from 'typeorm';
import { Product } from '../../domain/entities/product.entity';
import { Order } from '../../domain/entities/order.entity';
import { User } from '../../domain/entities/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'thera_consulting_db',
  entities: [Product, Order, User],
  migrations: ['src/infrastructure/database/migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});

