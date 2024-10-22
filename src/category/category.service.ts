/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import mongoose from 'mongoose';

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category.name)
        private categoryModel: mongoose.Model<Category>
    ) { }

    async findAll(): Promise<Category[]> {
        return this.categoryModel.find()
            .populate('rooms').exec()
    }

    async create(category: Category): Promise<Category> {
        return this.categoryModel.create(category)
    }
}
