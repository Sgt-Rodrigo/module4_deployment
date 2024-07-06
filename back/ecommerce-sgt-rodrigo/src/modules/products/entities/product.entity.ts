export class Product {
    /**
   * Unique identifier for the product, can be a string or number
   * @example 123e4567-e89b-12d3-a456-426614174000
   * @example 101
   */
    id: string | number;
    /**
   * Name of the product, must be a string
   * @example Super Widget
   */
    name: string;
     /**
   * Description of the product, must be a string
   * @example This is a high-quality widget used for various purposes.
   */
    description: string;
     /**
   * Price of the product, must be a number
   * @example 19.99
   */
    price: number;
    /**
   * Stock quantity of the product, must be a number
   * @example 150
   */
    stock: number;
     /**
   * Category ID to which the product belongs, must be a string
   * @example 5f8d04a6b5d09e2b6c4b4531
   */
    categoryID: string;
    /**
   * URL of the product image, must be a string
   * @example http://example.com/product-image.jpg
   */
    imageURL: string;

}

export type ID = Pick<Product, 'id'>