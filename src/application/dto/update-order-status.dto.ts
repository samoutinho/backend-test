import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../../domain/entities/order.entity';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'Status do pedido',
    enum: OrderStatus,
    example: OrderStatus.CONCLUIDO,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

