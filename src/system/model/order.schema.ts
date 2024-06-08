import { model, Model, Schema, Document } from 'mongoose';
import { IVariantOptions } from './product.schema';
import { SoftDeleteDocument } from 'mongoose-delete';
import paginate from 'mongoose-paginate-v2';
import MongooseDelete, { SoftDeleteModel } from 'mongoose-delete';
import { VariantOptionsSchema } from './product.schema';
export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    // add user cancel order
    USER_CANCELLED = 'USER_CANCELLED',
    CANCELLED = 'CANCELLED',
    DELIVERED = 'DELIVERED',
}

export interface IOrder extends Document, SoftDeleteDocument {
    _id: Object;
    userId: Object;
    items: Object[];
    total: number;
    nameUser: string;
    status: OrderStatus;
    phone: string;
    address: Object;
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

export const OrderItemModel: Model<IOrderItem> = model<IOrderItem>(
    'orderItem',
    OrderItemSchema,
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
        nameUser: { type: String, required: true },
        phone: { type: String, required: true },
        status: {
            type: String,
            enum: Object.values(OrderStatus),
            default: OrderStatus.PENDING,
        },
        address: { type: String, required: true }
    },
    { collection: 'order', timestamps: true },
);

OrderSchema.plugin(MongooseDelete, {
    deletedAt: true,
    overrideMethods: true,
});
OrderSchema.plugin(paginate);
// index phone and status 
OrderSchema.index({ phone: 'text', status: 'text', nameUser: 'text'});

export const OrderModel:SoftDeleteModel = model<IOrder>('order', OrderSchema);

