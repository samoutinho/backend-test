import { Order } from '../entities/order.entity';

export interface IOrderRepository {
  findAll(): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
  create(order: Partial<Order>): Promise<Order>;
  update(id: string, order: Partial<Order>): Promise<Order>;
}

