import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryPreLoad} from 'src/preloadData';
import { Category } from 'src/entities_db/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesDBService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async getCategories() {
    return this.categoriesRepository.find();
  }

  async addCategories(categories: CategoryPreLoad[]) {
    for (const category of categories) {
      const exists = await this.categoriesRepository.findOneBy({ name: category.name });
      if (!exists) {
        await this.categoriesRepository.save(category);
      }
    }
  }
}
