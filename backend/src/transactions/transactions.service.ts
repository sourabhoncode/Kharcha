import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from './transaction.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectModel(Transaction.name)
        private transactionModel: Model<TransactionDocument>,
    ) { }

    async create(createTransactionDto: CreateTransactionDto) {
        const createdTransaction = new this.transactionModel(createTransactionDto);
        return createdTransaction.save();
    }

    async findAll() {
        return this.transactionModel.find().exec();
    }

    async findById(id: string) {
        return this.transactionModel.findById(id).exec();
    }

    async update(id: string, updateData: any) {
        return this.transactionModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .exec();
    }

    async delete(id: string) {
        return this.transactionModel.findByIdAndDelete(id).exec();
    }

    async getBalance() {
        const transactions = await this.transactionModel.find().exec();
        return transactions.reduce((balance, transaction) => {
            return transaction.type === 'income'
                ? balance + transaction.amount
                : balance - transaction.amount;
        }, 0);
    }
}
