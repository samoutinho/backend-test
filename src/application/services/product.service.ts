import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import type { IProductRepository } from '../../domain/interfaces/product.repository.interface';
import { Product } from '../../domain/entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { PaginatedResult } from '../dto/pagination.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async findAllPaginated(page: number, limit: number): Promise<PaginatedResult<Product>> {
    return this.productRepository.findAllPaginated(page, limit);
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    if (createProductDto.preco < 0) {
      throw new BadRequestException('Price cannot be negative');
    }
    if (createProductDto.quantidade_estoque < 0) {
      throw new BadRequestException('Stock quantity cannot be negative');
    }
    return this.productRepository.create(createProductDto);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.findById(id); // Verifica se existe
    if (updateProductDto.preco !== undefined && updateProductDto.preco < 0) {
      throw new BadRequestException('Price cannot be negative');
    }
    if (
      updateProductDto.quantidade_estoque !== undefined &&
      updateProductDto.quantidade_estoque < 0
    ) {
      throw new BadRequestException('Stock quantity cannot be negative');
    }
    return this.productRepository.update(id, updateProductDto);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id); // Verifica se existe
    await this.productRepository.delete(id);
  }
}

