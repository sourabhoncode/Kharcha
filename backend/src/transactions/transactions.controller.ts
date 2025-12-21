import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from '../dtos';

@Controller('api/transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) { }

    @Post()
    create(@Body() createTransactionDto: CreateTransactionDto) {
        return this.transactionsService.create(createTransactionDto);
    }

    @Get()
    findAll() {
        return this.transactionsService.findAll();
    }

    @Get('balance')
    getBalance() {
        return this.transactionsService.getBalance();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.transactionsService.findById(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateData: any) {
        return this.transactionsService.update(id, updateData);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.transactionsService.delete(id);
    }
}
