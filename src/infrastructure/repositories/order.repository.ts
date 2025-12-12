import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../domain/entities/order.entity';
import { IOrderRepository } from '../../domain/interfaces/order.repository.interface';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  async findById(id: string): Promise<Order | null> {
    return this.orderRepository.findOne({ where: { id } });
  }

  async create(order: Partial<Order>): Promise<Order> {
    const newOrder = this.orderRepository.create(order);
    return this.orderRepository.save(newOrder);
  }

  async update(id: string, order: Partial<Order>): Promise<Order> {
    await this.orderRepository.update(id, order);
    const updatedOrder = await this.findById(id);
    if (!updatedOrder) {
      throw new Error('Order not found');
    }
    return updatedOrder;
  }
}

