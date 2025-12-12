import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../domain/entities/product.entity';
import { ProductController } from '../../presentation/controllers/product.controller';
import { ProductService } from '../services/product.service';
import { ProductRepository } from '../../infrastructure/repositories/product.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
  ],
  exports: [ProductService, 'IProductRepository'],
})
export class ProductModule {}

