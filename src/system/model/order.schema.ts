import { model, Model, Schema, Document } from 'mongoose';
import { IVariantOptions } from './product.schema';

export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    DELIVERED = 'DELIVERED',
}

export interface IOrder extends Document {
    _id: Object;
    userId: Object;
    items: Object[];
    total: number;
    status: OrderStatus;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IOrderItem extends Document {
    _id: Object;
    productId: Object;
    quantity: number;
    variantOptions: IVariantOptions[];
    price: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export const OrderItemSchema = new Schema<IOrderItem>(
    {
        productId: { type: Schema.Types.ObjectId, ref: 'product' },
        quantity: { type: Number, required: true },
        variantOptions: [
            {
                type: Schema.Types.ObjectId,
                ref: 'variantOptions',
            },
        ],
        price: { type: Number, required: true },
    },
    { collection: 'orderItem', timestamps: true },
);

export const OrderSchema = new Schema<IOrder>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'user' },
        items: [
            {
                type: Schema.Types.ObjectId,
                ref: 'orderItem',
            },
        ],
        total: { type: Number, required: true },
        status: {
            type: String,
            enum: Object.values(OrderStatus),
            default: OrderStatus.PENDING,
        },
    },
    { collection: 'order', timestamps: true },
);

export const OrderModel: Model<IOrder> = model<IOrder>('order', OrderSchema);
export const OrderItemModel: Model<IOrderItem> = model<IOrderItem>(
    'orderItem',
    OrderItemSchema,
);
