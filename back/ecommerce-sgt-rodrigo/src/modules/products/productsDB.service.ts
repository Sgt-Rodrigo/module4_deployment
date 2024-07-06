import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/entities_db/product.entity';
import { Category } from 'src/entities_db/category.entity';
import { preloadData } from 'src/preloadData';
import { CreateProductDto } from './dto/create-product.dto';
import { ID } from './entities/product.entity';
import { UpdateProductDto } from './dto/update-product.dto';



@Injectable()
export class ProductsDBService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  // async getProducts() {
  //   return this.productsRepository.find();
  // }

  async create(createProductDto: CreateProductDto) {
   try {
     const newProduct = this.productsRepository.create(createProductDto);
     return await this.productsRepository.save(newProduct);
   } catch (error) {
      throw new HttpException('Error creating product', HttpStatus.INTERNAL_SERVER_ERROR)
   }
}

  async getAllProducts(page:number = 1, limit:number = 5 ){

    try {
      const skip = (page - 1) * limit; //w calculate the offset
      const response = await this.productsRepository.find({
          skip,
          take: limit,
      });

      //w handles the retrieved products as needed

      return response; //w returns the paginated results
  } catch (error) {
      throw new HttpException('Error fetching all products', HttpStatus.INTERNAL_SERVER_ERROR);
  }
    // try {
    //     const response = await this.productsRepository.find()
       
    // } catch (error) {
    //     throw new HttpException('Error fetching all products', HttpStatus.INTERNAL_SERVER_ERROR)
    // }
}


async findOne(id: string) {
  try {
    const product = await this.productsRepository.findOne({
        where: { id },
    });
  
    if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
    }
  
    return product;
  } catch (error) {
    if(error instanceof NotFoundException) {
      throw error
    } else {
      throw new HttpException ('Error fetching the product', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}


async updatePut(id: string, updateProductDto: UpdateProductDto) {
  const existingProduct = await this.productsRepository.findOne({where:{id}});

  if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
  }

  //w update the product properties based on the DTO
  existingProduct.id = id;
  existingProduct.name = updateProductDto.name;
  existingProduct.description = updateProductDto.description;
  existingProduct.price = updateProductDto.price;
  existingProduct.stock = updateProductDto.stock;

  //w fetch the actual Category entity based on categoryID
  const category = await this.categoriesRepository.findOne({ where: { id: updateProductDto.categoryID } });
  if (!category) {
      throw new NotFoundException(`Category with ID ${updateProductDto.categoryID} not found`);
  }
  existingProduct.category_id = category;

  //w save the updated product, returns the saved product back
 return await this.productsRepository.save(existingProduct);
}



async remove(id:string) {
 try {
   //w checks if the product exists
   const product = await this.productsRepository.findOne({where:{id}});
   if (!product) {
     throw new NotFoundException(`Product with ID ${id} not found`);
   }
 
   //w  deletes it
   await this.productsRepository.delete(id);
   return `Product ${id} removed succesfully`
 } catch (error) {
    if(error instanceof NotFoundException) {
      throw error
    } else {
      throw new HttpException('Error removing product', HttpStatus.INTERNAL_SERVER_ERROR)
    }
 }
}


//w saves image url
async updateImageUrl(id: string, imageUrl: string): Promise<void> {
  const product = await this.findOne(id);
  if (!product) {
    throw new InternalServerErrorException('Product not found');
  }
  product.imgUrl = imageUrl;
  await this.productsRepository.save(product);
}


  //* this is the PRODUCTS PRELOAD
  async addProducts() {
    try {
        for (const productData of preloadData) {
            const exists = await this.productsRepository.findOne({ where: { name: productData.name } });
          if (!exists) {
            const category = await this.categoriesRepository.findOne({ where: { name: productData.category } });
            if (category) {
              const product = new Product();
              product.name = productData.name;
              product.description = productData.description;
              product.price = productData.price;
              product.stock = productData.stock;
              product.category_id = category;
              await this.productsRepository.save(product);
            }
          }
        }

        return 'Products Preloaded Succesfully'
    } catch (error) {
        throw new HttpException('Failed : Products Preload', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
