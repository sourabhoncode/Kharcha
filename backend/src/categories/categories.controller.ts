import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from '../dtos';

@Controller('api/categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }

    @Get()
    findAll() {
        return this.categoriesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoriesService.findById(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateData: any) {
        return this.categoriesService.update(id, updateData);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.categoriesService.delete(id);
    }
}
