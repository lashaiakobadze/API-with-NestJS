import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Category from './category.entity';
import UpdateCategoryDto from './dto/updateCategory.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  getAllCategories() {
    return this.categoriesRepository.find({ relations: ['posts'] });
  }

  async getCategoryById(id: number) {
    const category = await this.categoriesRepository.find({
      where: { id },
      relations: ['posts'],
    });
    if (category) {
      return category;
    }
    new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async updateCategory(id: number, category: UpdateCategoryDto) {
    await this.categoriesRepository.update(id, category);
    const updatedCategory = await this.categoriesRepository.find({
        where: { id },
        relations: ['posts'],
      });
    if (updatedCategory) {
      return updatedCategory;
    }
    new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }
}
