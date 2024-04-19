import { model, Model, Schema, Document } from 'mongoose';
export interface ICategory extends Document {
    _id: Object;
    name: string;
    description: string;
    slug: string;
    createdAt?: Date;
    updatedAt?: Date;
}
const ICategorySchema = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: true,
            index: true,
        },
        description: { type: String, required: true },
    },
    { collection: 'category', timestamps: true },
);
export const CategoryModel: Model<ICategory> = model<ICategory>(
    'category',
    ICategorySchema,
);
