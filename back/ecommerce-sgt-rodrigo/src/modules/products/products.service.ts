import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepositoryService } from './products.repository';
import { ID } from './entities/product.entity';
import { ProductsDBService } from './productsDB.service';

@Injectable()
export class ProductsService  {

  constructor( private readonly productRepo:ProductsRepositoryService,
               private readonly productsDBService: ProductsDBService
  ) {}

  //w preloads products
  async addProducts(){
   try {
     const response = await this.productsDBService.addProducts();
     return response
   } catch (error) {
    throw error
   }
  }

  async create(createProductDto: CreateProductDto) {
  try {
      const response = await this.productsDBService.create(createProductDto);
      return response
  } catch (error) {
    //w re-throw
    throw error
  }
  }

  async findAll(page:number, limit: number) {
   try {
    const response = await this.productsDBService.getAllProducts(page, limit);
    return response
   } catch (error) {
    throw error
   }
  }

  async findOne(id: string) {
    try {
      const response = await this.productsDBService.findOne(id);
      return response
    } catch (error) {
      throw error
    }
  }

  async updatePut(id: string, updateProductDto: UpdateProductDto) {
   try {
    const response = await this.productsDBService.updatePut(id, updateProductDto);
    return response
   } catch (error) {
    throw error
   }
  }

  async remove(id:string) {
   try {
    const response = await this.productsDBService.remove(id);
    return response
   } catch (error) {
    throw error
   }
  }
}
