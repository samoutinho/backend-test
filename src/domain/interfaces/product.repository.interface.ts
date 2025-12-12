import { Product } from '../entities/product.entity';
import { PaginatedResult } from '../../application/dto/pagination.dto';

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findAllPaginated(page: number, limit: number): Promise<PaginatedResult<Product>>;
  findById(id: string): Promise<Product | null>;
  create(product: Partial<Product>): Promise<Product>;
  update(id: string, product: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<void>;
}

