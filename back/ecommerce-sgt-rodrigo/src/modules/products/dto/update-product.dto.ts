import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { Category } from 'src/entities_db/category.entity';
import { IsNumber, IsString, IsUrl, IsUUID, MaxLength } from 'class-validator';

export class UpdateProductDto {
  /**
   * Unique identifier for the order, generated as a UUID
   * @example f4219523-2d0c-4534-b3c1-257d62fe674d
   */
  @IsUUID()
  id: string;
  /**
   * Name of the product, must be a string
   * @example 'Printer HP'
   */
  @IsString()
  @MaxLength(50)
  name: string;
  /**
   * Description of the product, must be a string
   * @example 'This is a high-quality printer used for various purposes.'
   */
  @IsString()
  @MaxLength(500)
  description: string;
  /**
   * Price of the product, must be a number
   * @example 300
   */
  @IsNumber()
  price: number;
  /**
   * Stock quantity of the product, must be a number
   * @example 150
   */
  @IsNumber()
  stock: number;
  /**
   * Category ID to which the product belongs, must be a string
   * @example d06bfa7a-9bc9-462f-b7e5-046a14e54f04
   */

  @IsUUID()
  categoryID: string;
  /**
   * URL of the product image, must be a string
   * @example http://example.com/product-image.jpg
   */
  @IsUrl()
  imageURL: string;
}
