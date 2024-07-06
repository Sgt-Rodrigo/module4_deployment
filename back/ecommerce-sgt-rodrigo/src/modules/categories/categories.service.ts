import { Injectable } from '@nestjs/common';
import { CategoriesDBService } from './categoriesDB.service';
import { CategoryPreLoad } from 'src/preloadData';

@Injectable()
export class CategoriesService {
    constructor(private readonly categoriesDBService:CategoriesDBService) {}
    
    async addCategories(categories:CategoryPreLoad[]){
        const response = await this.categoriesDBService.addCategories(categories)
    }
}
