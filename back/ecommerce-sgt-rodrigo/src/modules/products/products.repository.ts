import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import axios from 'axios';
import { UpdateProductDto } from './dto/update-product.dto';
import { ID } from './entities/product.entity';

@Injectable()
export class ProductsRepositoryService {
    private readonly jsonServerURL = 'http://localhost:8000/products';

    async create(productData:CreateProductDto){
        try {
            const response = await axios.post(this.jsonServerURL, productData);
            return response.data
        } catch (error) {
            throw new HttpException('Error creating product', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updatePut(id:string, productData:UpdateProductDto) {
        try {
            const response = await axios.put(`${this.jsonServerURL}/${id}`, productData);
            return response.data
        } catch (error) {
            throw new HttpException('Error updating product', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async remove(id:ID){
        try {
            const response = await axios.delete(`${this.jsonServerURL}/${id}`);
            return response.data
        } catch (error) {
            throw new HttpException('Error removing product', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findOne(id:ID){
        try {
            const response = await axios.get(`${this.jsonServerURL}/${id}`);
            return response.data
        } catch (error) {
            throw new HttpException('Error fetching product', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findAll(page:number = 1, limit:number = 5 ){
        try {
            const response = await axios.get(`${this.jsonServerURL}?_page=${page}&_limit=${limit}`)
            return response.data
        } catch (error) {
            throw new HttpException('Error fetching all products', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
