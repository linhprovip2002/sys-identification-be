import { model, Model, Schema, Document } from 'mongoose';
import { IProduct } from './product.schema';
import paginate from 'mongoose-paginate-v2';
import { SoftDeleteDocument } from 'mongoose-delete';
import MongooseDelete, { SoftDeleteModel } from 'mongoose-delete';
export interface ICardBreed extends Document {
    _id: Object;
    breed_name: string;
    appearance: string; // Appearance of the breed
    behavior: string; // Behavior of the breed
    common_health_issues: string; // Common health issues of the breed
    diet: IProduct;
    breedImages: string[]; // Images of the breed
    description: string;
    htmlDomDescription: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export const CardBreedSchema = new Schema<ICardBreed>(
    {
        breed_name: { type: String, required: true },
        appearance: { type: String, required: true },
        behavior: { type: String, required: true },
        common_health_issues: { type: String, required: true },
        diet: [{ type: Schema.Types.ObjectId, ref: 'product' }],
        breedImages: [
            {
                type: String,
            },
        ],
        description: { type: String, required: true },
        htmlDomDescription: { type: String },
    },
    { collection: 'cardBreed', timestamps: true },
);
CardBreedSchema.plugin(MongooseDelete, {
    deletedAt: true,
    overrideMethods: true,
});
CardBreedSchema.plugin(paginate);

export const CardBreedModel: SoftDeleteModel = model<ICardBreed>(
    'cardBreed',
    CardBreedSchema,
);
