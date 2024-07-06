import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { Category } from "./category.entity";
import { OrderDetail } from "./order_detail.entity";
uuidv4();

@Entity({
  name: 'products'
})
export class Product {
  /**
   * Unique identifier for the product, generated as a UUID
   * @example 123e4567-e89b-12d3-a456-426614174000
   */
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

   /**
   * Name of the product, must be a string up to 50 characters
   * @example Smartphone
   */
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  /**
   * Description of the product, must be a text
   * @example Latest model smartphone with advanced features
   */
  @Column('text', {nullable: false})
  description: string;

  /**
   * Price of the product, stored as a decimal with precision 10 and scale 2
   * @example 699.99
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  /**
   * Stock quantity of the product, must be an integer
   * @example 50
   */
  @Column('int', {nullable: false})
  stock: number;

  /**
   * Image URL of the product, defaults to 'default image'
   * @example http://example.com/smartphone.jpg
   */
  //w image default handled on create-product-dto
  @Column({ type: 'varchar', nullable: true, default: 'https://res.cloudinary.com/da73rab2q/image/upload/v1716943567/mj1uafvrolxvn6dlenij.jpg' })
  imgUrl: string;

   /**
   * Category associated with the product
   * @example {
   *  "id": "550e8400-e29b-41d4-a716-446655440000",
   *  "name": "Electronics"
   * }
   */
  @ManyToOne(() => Category, category => category.products)
  @JoinColumn({name: 'category_id'})
  category_id: Category;

  /**
   * List of order details associated with the product
   * @example [
   *  {
   *    "id": "550e8400-e29b-41d4-a716-446655440000",
   *    "price": 699.99,
   *    "order": {
   *      "id": "550e8400-e29b-41d4-a716-446655440000",
   *      "date": "2024-05-30T14:48:00.000Z",
   *      "total": 699.99
   *    }
   *  }
   * ]
   */
  @ManyToMany(() => OrderDetail, orderDetail => orderDetail.products)
  //w JoinTable goes in the owner of the relationship
  //w if not set explicitly, typeorm handles the creation of the junction table automatically. Just use it if you need to change the name or what ave u
  @JoinTable()
  orderDetails: OrderDetail[];
}