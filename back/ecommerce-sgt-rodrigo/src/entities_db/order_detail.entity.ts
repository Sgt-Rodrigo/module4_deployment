import { Column, Entity, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "./product.entity";
import { Exclude } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';
import { ApiProperty } from "@nestjs/swagger";
uuidv4();

@Entity({
  name: 'order_details'
})
export class OrderDetail {
  /**
   * Unique identifier for the order detail, generated as a UUID
   * @example 550e8400-e29b-41d4-a716-446655440000
   */
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  /**
   * Price of the order detail, stored as a decimal with precision 10 and scale 2, defaults to 0
   * @example 199.99
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number = 0;

  /**
   * Order associated with the order detail, excluded from serialization
   */
  @Exclude()
  @OneToOne(() => Order, order => order.orderDetail)
  order: Order;

 
  @ApiProperty({
    example: [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Smartphone',
        description: 'Latest model smartphone with advanced features',
        price: 699.99,
        stock: 50,
        categoryID: '550e8400-e29b-41d4-a716-446655440000',
        imageURL: 'http://example.com/smartphone.jpg',
      },
    ],
  })
  @ManyToMany(() => Product, product => product.orderDetails)
  products: Product[];
}