import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ default: 'aaa@mail.com', required: true, type: String })
  email: string;

  @ApiProperty({ default: 'product 1', required: true, type: String })
  productName: string;

  @ApiProperty({ default: 2, required: true, type: Number })
  quantity: number;
}
