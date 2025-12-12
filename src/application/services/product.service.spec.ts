import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ProductService } from './product.service';
import { IProductRepository } from '../../domain/interfaces/product.repository.interface';
import { Product } from '../../domain/entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';

describe('ProductService', () => {
  let service: ProductService;
  let repository: jest.Mocked<IProductRepository>;

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

  const mockRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: 'IProductRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get('IProductRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const products = [mockProduct];
      repository.findAll.mockResolvedValue(products);

      const result = await service.findAll();

      expect(result).toEqual(products);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return a product when found', async () => {
      repository.findById.mockResolvedValue(mockProduct);

      const result = await service.findById(mockProduct.id);

      expect(result).toEqual(mockProduct);
      expect(repository.findById).toHaveBeenCalledWith(mockProduct.id);
    });

    it('should throw NotFoundException when product not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      const createDto: CreateProductDto = {
        nome: 'Notebook Dell',
        categoria: 'Eletrônicos',
        descricao: 'Notebook Dell Inspiron 15',
        preco: 2999.99,
        quantidade_estoque: 10,
      };

      repository.create.mockResolvedValue(mockProduct);

      const result = await service.create(createDto);

      expect(result).toEqual(mockProduct);
      expect(repository.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw BadRequestException when price is negative', async () => {
      const createDto: CreateProductDto = {
        nome: 'Notebook Dell',
        categoria: 'Eletrônicos',
        preco: -100,
        quantidade_estoque: 10,
      };

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when stock is negative', async () => {
      const createDto: CreateProductDto = {
        nome: 'Notebook Dell',
        categoria: 'Eletrônicos',
        preco: 2999.99,
        quantidade_estoque: -10,
      };

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update a product successfully', async () => {
      const updateDto = { preco: 3499.99 };
      const updatedProduct = { ...mockProduct, preco: 3499.99 };

      repository.findById.mockResolvedValue(mockProduct);
      repository.update.mockResolvedValue(updatedProduct);

      const result = await service.update(mockProduct.id, updateDto);

      expect(result).toEqual(updatedProduct);
      expect(repository.update).toHaveBeenCalledWith(mockProduct.id, updateDto);
    });

    it('should throw NotFoundException when product not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.update('invalid-id', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a product successfully', async () => {
      repository.findById.mockResolvedValue(mockProduct);
      repository.delete.mockResolvedValue(undefined);

      await service.delete(mockProduct.id);

      expect(repository.delete).toHaveBeenCalledWith(mockProduct.id);
    });

    it('should throw NotFoundException when product not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.delete('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

