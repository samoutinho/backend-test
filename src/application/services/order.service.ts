import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { IOrderRepository } from '../../domain/interfaces/order.repository.interface';
import { IProductRepository } from '../../domain/interfaces/product.repository.interface';
import {
  Order,
  OrderStatus,
  OrderItem,
} from '../../domain/entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }

  async findById(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const orderItems: OrderItem[] = [];
    let totalPedido = 0;

    // Validar estoque e calcular total
    for (const item of createOrderDto.produtos) {
      const product = await this.productRepository.findById(item.product_id);
      if (!product) {
        throw new NotFoundException(
          `Product with ID ${item.product_id} not found`,
        );
      }

      if (product.quantidade_estoque < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.nome}. Available: ${product.quantidade_estoque}, Requested: ${item.quantity}`,
        );
      }

      const orderItem: OrderItem = {
        product_id: item.product_id,
        quantity: item.quantity,
        price: Number(product.preco),
      };
      orderItems.push(orderItem);

      totalPedido += Number(product.preco) * item.quantity;
    }

    const order = new Order();
    order.produtos = orderItems;
    order.total_pedido = totalPedido;
    order.status = OrderStatus.PENDENTE;

    return this.orderRepository.create(order);
  }

  async updateStatus(
    id: string,
    updateStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const order = await this.findById(id);

    // Se mudando para Concluído, atualizar estoque
    if (
      updateStatusDto.status === OrderStatus.CONCLUIDO &&
      order.status !== OrderStatus.CONCLUIDO
    ) {
      for (const item of order.produtos) {
        const product = await this.productRepository.findById(item.product_id);
        if (!product) {
          throw new NotFoundException(
            `Product with ID ${item.product_id} not found`,
          );
        }

        const newStock = product.quantidade_estoque - item.quantity;
        if (newStock < 0) {
          throw new BadRequestException(
            `Cannot complete order: insufficient stock for product ${product.nome}`,
          );
        }

        await this.productRepository.update(item.product_id, {
          quantidade_estoque: newStock,
        });
      }
    }

    // Se cancelando um pedido concluído, reverter estoque
    if (
      updateStatusDto.status === OrderStatus.CANCELADO &&
      order.status === OrderStatus.CONCLUIDO
    ) {
      for (const item of order.produtos) {
        const product = await this.productRepository.findById(item.product_id);
        if (product) {
          await this.productRepository.update(item.product_id, {
            quantidade_estoque: product.quantidade_estoque + item.quantity,
          });
        }
      }
    }

    return this.orderRepository.update(id, { status: updateStatusDto.status });
  }
}

