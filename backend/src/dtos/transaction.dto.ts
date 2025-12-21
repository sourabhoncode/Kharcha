export class CreateTransactionDto {
    amount!: number;
    type!: 'income' | 'expense';
    category!: string;
    description?: string;
    date!: Date;
}

export class UpdateTransactionDto {
    amount?: number;
    type?: 'income' | 'expense';
    category?: string;
    description?: string;
    date?: Date;
    isActive?: boolean;
}
