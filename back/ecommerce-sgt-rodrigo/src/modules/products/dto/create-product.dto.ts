import {
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  /**
   * Name of the product, must be a string
   * @example 'Speakers Samsung'
   */
  @IsString()
  @MaxLength(50)
  name: string;
  /**
   * Description of the product, must be a string
   * @example 'This is a high-quality speaker used for various purposes.'
   */
  @IsString()
  @MaxLength(500)
  description: string;
  /**
   * Price of the product, must be a number
   * @example 200.99
   */
  @IsNumber()
  price: number;
  /**
   * Stock quantity of the product, must be a number
   * @example 100
   */
  @IsNumber()
  stock: number;
  /**
   * Category ID to which the product belongs, must be a string
   * @example 5f8d04a6b5d09e2b6c4b4531
   */
  @IsString()
  categoryID: string;
  /**
   * URL of the product image, must be a string
   * @example http://example.com/product-image.jpg
   */
  //w sets default image url if none if passed in body
  @IsUrl()
  @IsOptional()
  imageURL: string ='https://res.cloudinary.com/da73rab2q/image/upload/v1716943567/mj1uafvrolxvn6dlenij.jpg';
}
