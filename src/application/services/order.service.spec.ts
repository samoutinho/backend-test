import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { OrderService } from './order.service';
import { IOrderRepository } from '../../domain/interfaces/order.repository.interface';
import { IProductRepository } from '../../domain/interfaces/product.repository.interface';
import { Order, OrderStatus } from '../../domain/entities/order.entity';
import { Product } from '../../domain/entities/product.entity';
import { CreateOrderDto } from '../dto/create-order.dto';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: jest.Mocked<IOrderRepository>;
  let productRepository: jest.Mocked<IProductRepository>;

  const mockProduct: Product = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    nome: 'Notebook Dell',
    categoria: 'Eletrônicos',
    descricao: 'Notebook Dell Inspiron 15',
    preco: 2999.99,
    quantidade_estoque: 10,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockOrder: Order = {
    id: 'order-123',
    status: OrderStatus.PENDENTE,
    total_pedido: 5999.98,
    produtos: [
      {
        product_id: mockProduct.id,
        quantity: 2,
        price: 2999.99,
      },
    ],
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockOrderRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  const mockProductRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: 'IOrderRepository',
          useValue: mockOrderRepository,
        },
        {
          provide: 'IProductRepository',
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get('IOrderRepository');
    productRepository = module.get('IProductRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an order successfully', async () => {
      const createDto: CreateOrderDto = {
        produtos: [
          {
            product_id: mockProduct.id,
            quantity: 2,
          },
        ],
      };

      productRepository.findById.mockResolvedValue(mockProduct);
      orderRepository.create.mockResolvedValue(mockOrder);

      const result = await service.create(createDto);

      expect(result).toEqual(mockOrder);
      expect(productRepository.findById).toHaveBeenCalledWith(mockProduct.id);
      expect(orderRepository.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException when product not found', async () => {
      const createDto: CreateOrderDto = {
        produtos: [
          {
            product_id: 'invalid-id',
            quantity: 1,
          },
        ],
      };

      productRepository.findById.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when insufficient stock', async () => {
      const createDto: CreateOrderDto = {
        produtos: [
          {
            product_id: mockProduct.id,
            quantity: 20, // Mais do que o estoque disponível (10)
          },
        ],
      };

      productRepository.findById.mockResolvedValue(mockProduct);

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateStatus', () => {
    it('should update order status to CONCLUIDO and update stock', async () => {
      const updatedOrder = { ...mockOrder, status: OrderStatus.CONCLUIDO };

      orderRepository.findById.mockResolvedValue(mockOrder);
      productRepository.findById.mockResolvedValue(mockProduct);
      productRepository.update.mockResolvedValue({
        ...mockProduct,
        quantidade_estoque: 8, // 10 - 2
      });
      orderRepository.update.mockResolvedValue(updatedOrder);

      const result = await service.updateStatus(mockOrder.id, {
        status: OrderStatus.CONCLUIDO,
      });

      expect(result.status).toBe(OrderStatus.CONCLUIDO);
      expect(productRepository.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException when order not found', async () => {
      orderRepository.findById.mockResolvedValue(null);

      await expect(
        service.updateStatus('invalid-id', { status: OrderStatus.CONCLUIDO }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});

