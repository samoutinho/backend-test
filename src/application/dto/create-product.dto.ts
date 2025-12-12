import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Nome do produto', example: 'Notebook Dell' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({
    description: 'Categoria do produto',
    example: 'Eletrônicos',
  })
  @IsString()
  @IsNotEmpty()
  categoria: string;

  @ApiPropertyOptional({
    description: 'Descrição do produto',
    example: 'Notebook Dell Inspiron 15',
  })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiProperty({ description: 'Preço do produto', example: 2999.99 })
  @IsNumber()
  @Min(0)
  preco: number;

  @ApiProperty({
    description: 'Quantidade em estoque',
    example: 10,
    default: 0,
  })
  @IsNumber()
  @Min(0)
  quantidade_estoque: number;
}

