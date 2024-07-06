import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Res, UseGuards, SetMetadata, ParseUUIDPipe, Query, UseInterceptors, UploadedFile, InternalServerErrorException, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { CloudinaryService } from 'src/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsDBService } from './productsDB.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/roles/roles.enum';

@ApiTags('Products')
@UseGuards(AuthGuard)
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly productsDBService: ProductsDBService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto, @Res() res:Response) {
   try {
    const response = await this.productsService.create(createProductDto);
    return res.status(201).json(response.id)
    
    // return res.status(201).json({
    //   message: 'Product registered successfully',
    //   product: response
    // })
   } catch (error) {
    throw error
   }
  }

  @Post('seeder')
  @SetMetadata('isPublic', true)
  async seedProducts() {
   try {
     const response = await this.productsService.addProducts();
     return response
   } catch (error) {
    throw error
   }
  }

  //w image uploader
  @Post('files/uploadImage/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile(
      new ParseFilePipe({
        validators:[
          new MaxFileSizeValidator({
            maxSize:200000,
            message:'File must be under 200kb'
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)$/
           })
        ]
      })
  ) file: Express.Multer.File, @Param('id') productId: string) {
    try {

      let imageUrl:string;

      if(!file){
        imageUrl = 'https://res.cloudinary.com/da73rab2q/image/upload/v1716943567/mj1uafvrolxvn6dlenij.jpg'
      } else {
        //w uploads the image to Cloudinary
        const uploadResult = await this.cloudinaryService.uploadImage(file);
        //w extracts the secure URL from the upload result
        imageUrl = uploadResult.secure_url
      }

      //w updates the product image URL
      await this.productsDBService.updateImageUrl(productId, imageUrl);

      return { message: 'Image uploaded and product image URL updated successfully' };
    } catch (error) {
      //w handles any errors (e.g., failed upload or database update)
      console.error('Error uploading image:', error);
      throw new InternalServerErrorException('Error uploading image');
    }
  }

  @ApiBearerAuth()
  @SetMetadata('isPublic', true)
  @Get()
    async findAll(
        @Query('page') page: number, // Extract the 'page' query parameter
        @Query('limit') limit: number, // Extract the 'limit' query parameter
        @Res() res: Response,
    ) {
        try {
            const response = await this.productsService.findAll(page, limit);
            return res.status(200).json({
                message: 'Products fetched successfully',
                allProducts: response,
            });
        } catch (error) {
            throw error;
        }
    }

  @ApiBearerAuth()
  @SetMetadata('isPublic', true)
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    try {
      const response = await this.productsService.findOne(id);
      return res.status(200).json({
        message:'Product fetched succesfully',
        product: response
      })
    } catch (error) {
      throw error
    }
  }

  @ApiBearerAuth()
  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async updatePut(@Param('id', ParseUUIDPipe) id: string, 
                  @Body() updateProductDto: UpdateProductDto,
                  @Res() res:Response
                ) {
  try {
      const response = await this.productsService.updatePut(id, updateProductDto);
      return res.status(200).json({
        message: `${response.name} updated`,
        id:response.id        
      })
  } catch (error) {
    throw error
  }
  }

  // @Patch(':id')
  // updatePatch(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  //   return this.productsService.update(+id, updateProductDto);
  // }

  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    try {
      const response = await this.productsService.remove(id);
      return res.status(200).json({
        message: 'Product deleted successfully',
        id: response
      })
    } catch (error) {
      throw error
    }
  }
}
  