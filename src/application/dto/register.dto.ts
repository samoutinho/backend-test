import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'Nome do usuário', example: 'João Silva' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Email do usuário', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Senha do usuário', example: 'password123' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

