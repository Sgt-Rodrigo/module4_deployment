import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { Product } from "./product.entity";
uuidv4();

@Entity({
  name: 'categories'
})
export class Category {
  /**
   * Unique identifier for the category, generated as a UUID
   * @example 550e8400-e29b-41d4-a716-446655440000
   */
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  /**
   * Name of the category, must be a string up to 50 characters
   * @example Electronics
   */
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  /**
   * List of products associated with the category
   * @example [
   *  {
   *    "id": "123e4567-e89b-12d3-a456-426614174000",
   *    "name": "Smartphone",
   *    "description": "Latest model smartphone with advanced features",
   *    "price": 699.99,
   *    "stock": 50,
   *    "categoryID": "550e8400-e29b-41d4-a716-446655440000",
   *    "imageURL": "http://example.com/smartphone.jpg"
   *  }
   * ]
   */
  //w Category relates to => Product, each product will have a product.category_id(this last property name MUST be replicated in the Products entity)
  //w products is an arrays of objects of type Product
  @OneToMany(() => Product, product => product.category_id)
  products: Product[];
}
