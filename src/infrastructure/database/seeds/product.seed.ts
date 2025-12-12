import { DataSource } from 'typeorm';
import { Product } from '../../../domain/entities/product.entity';

export async function seedProducts(dataSource: DataSource): Promise<void> {
  const productRepository = dataSource.getRepository(Product);

  const products = [
    {
      nome: 'Notebook Dell Inspiron 15',
      categoria: 'Eletrônicos',
      descricao: 'Notebook Dell Inspiron 15 com processador Intel i5, 8GB RAM, 256GB SSD',
      preco: 2999.99,
      quantidade_estoque: 10,
    },
    {
      nome: 'Mouse Logitech MX Master 3',
      categoria: 'Periféricos',
      descricao: 'Mouse sem fio Logitech MX Master 3 com sensor de alta precisão',
      preco: 399.99,
      quantidade_estoque: 25,
    },
    {
      nome: 'Teclado Mecânico RGB',
      categoria: 'Periféricos',
      descricao: 'Teclado mecânico com iluminação RGB, switches azuis',
      preco: 599.99,
      quantidade_estoque: 15,
    },
    {
      nome: 'Monitor LG UltraWide 29"',
      categoria: 'Eletrônicos',
      descricao: 'Monitor LG UltraWide 29 polegadas, resolução 2560x1080',
      preco: 1299.99,
      quantidade_estoque: 8,
    },
    {
      nome: 'Webcam Logitech C920',
      categoria: 'Periféricos',
      descricao: 'Webcam Full HD 1080p com microfone estéreo',
      preco: 449.99,
      quantidade_estoque: 12,
    },
  ];

  for (const productData of products) {
    const existingProduct = await productRepository.findOne({
      where: { nome: productData.nome },
    });

    if (!existingProduct) {
      const product = productRepository.create(productData);
      await productRepository.save(product);
      console.log(`Produto criado: ${productData.nome}`);
    } else {
      console.log(`Produto já existe: ${productData.nome}`);
    }
  }
}

