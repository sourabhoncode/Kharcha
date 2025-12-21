import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: true })
export class Transaction {
    @Prop({ required: true })
    amount!: number;

    @Prop({ required: true })
    type!: 'income' | 'expense';

    @Prop({ required: true })
    category!: string;

    @Prop()
    description?: string;

    @Prop({ required: true })
    date!: Date;

    @Prop({ default: true })
    isActive!: boolean;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
