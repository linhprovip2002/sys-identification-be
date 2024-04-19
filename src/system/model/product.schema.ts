import { model, Model, Schema, Document } from 'mongoose';
import { SoftDeleteDocument } from 'mongoose-delete';
import paginate from 'mongoose-paginate-v2';
import MongooseDelete, { SoftDeleteModel } from 'mongoose-delete';
import { ICategory } from './category.schema';
export interface IProduct extends Document, SoftDeleteDocument {
    _id: Object;
    productImage: string[];
    name: string;
    description: string;
    variantOptions: IVariantOptions[];
    categoryID: ICategory['_id'];
    htmlDomDescription: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IVariantOptions extends Document, SoftDeleteDocument {
    _id: Object;
    name: string;
    value: string;
    price: number;
    quantity: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export const VariantOptionsSchema = new Schema<IVariantOptions>(
    {
        name: { type: String },
        value: { type: String },
        price: { type: Number, required: true },
        quantity: { type: Number },
    },
    { collection: 'variantOptions', timestamps: true },
);
export const VariantOptionsModel: Model<IVariantOptions> =
    model<IVariantOptions>('variantOptions', VariantOptionsSchema);

// Schema IProductSchema
const IProductSchema = new Schema<IProduct>(
    {
        productImage: [
            {
                type: String,
            },
        ],
        name: { type: String, required: true },
        description: { type: String, required: true },
        categoryID: [{ type: Schema.Types.ObjectId, ref: 'category' }],
        variantOptions: [
            {
                type: Schema.Types.ObjectId,
                ref: 'variantOptions',
            },
        ],
        htmlDomDescription: { type: String },
    },
    { collection: 'product', timestamps: true },
);
IProductSchema.plugin(MongooseDelete, {
    deletedAt: true,
    overrideMethods: true,
});
IProductSchema.plugin(paginate);
IProductSchema.index({ name: 'text', description: 'text' });
export const ProductModel: SoftDeleteModel = model<IProduct>(
    'product',
    IProductSchema,
);
