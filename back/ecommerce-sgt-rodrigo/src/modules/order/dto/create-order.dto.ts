import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsUUID, ValidateNested } from "class-validator";
import { Product } from "src/entities_db/product.entity";

export class OrderedProduct extends PartialType(Product) {
   /**
   * Unique identifier for the product, must be a valid UUID
   * @example e68fa465-717a-4b9b-9439-7d01a0fb5a44
   */
    @IsNotEmpty({ message: 'User ID is required' })
    @IsUUID('all', { message: 'User ID must be a valid UUID' })
    id: string;
  }

export class CreateOrderDto {
   /**
   * User ID associated with the order, must be a valid UUID
   * @example b5a6c433-77a0-4b99-a6db-f472f7a7e764
   */
  //w 'all' for all UUID versions
    @IsNotEmpty({ message: 'User ID is required' })
    @IsUUID('all', { message: 'User ID must be a valid UUID' })
    user_id: string; 
  
    /**
   * List of ordered products, must contain at least one product
   * @example [{ "id": "bb8ebe58-4e49-46f3-8d26-00c40174afe0" }]
   */
  //w validateNested will run validation in each object in the array based on the validators set in the OrderedProduct class
    @ApiProperty({
      example: [{ "id": "e68fa465-717a-4b9b-9439-7d01a0fb5a44" }],
    })
    @IsArray({ message: 'At least one product is required' })
    @ArrayMinSize(1, { message: 'At least one product is required' }) 
  @ValidateNested({ each: true })
  @Type(() => OrderedProduct)
  products: OrderedProduct[];
  }
