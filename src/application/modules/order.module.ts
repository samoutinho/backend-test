import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../domain/entities/order.entity';
import { OrderController } from '../../presentation/controllers/order.controller';
import { OrderService } from '../services/order.service';
import { OrderRepository } from '../../infrastructure/repositories/order.repository';
import { ProductModule } from './product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), ProductModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: 'IOrderRepository',
      useClass: OrderRepository,
    },
  ],
})
export class OrderModule {}

