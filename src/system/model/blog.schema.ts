import { model, Model, Schema, Document, Mongoose } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { SoftDeleteDocument } from 'mongoose-delete';
import MongooseDelete, { SoftDeleteModel } from 'mongoose-delete';

export interface IBlog extends Document, SoftDeleteDocument {
    _id: Object;
    title: string;
    content: string;
    category: Object;
    createdAt?: Date;
    shortContent: string;
    ate;
    updatedAt?: Date;
    thumbnail: { type: String };
}

const BlogSchema = new Schema<IBlog>(
    {
        title: { type: String },
        content: { type: String },
        category: { type: Schema.Types.ObjectId, ref: 'category' },
        shortContent: { type: String },
        thumbnail: { type: String },
    },
    { collection: 'blog', timestamps: true },
);

BlogSchema.plugin(MongooseDelete, { deletedAt: true, overrideMethods: true });
BlogSchema.plugin(paginate);
// index title to search
BlogSchema.index({ title: 'text' });
//virtual format day
BlogSchema.virtual('createDate').get(function (this: any) {
    return `${this.createdAt.getDate()}/${this.createdAt.getMonth()}/${this.createdAt.getFullYear()} - ${this.createdAt.getHours()}:${this.createdAt.getMinutes()}:${this.createdAt.getSeconds()}`;
});
BlogSchema.virtual('updateDate').get(function (this: any) {
    return `${this.updatedAt.getDate()}/${this.updatedAt.getMonth()}/${this.updatedAt.getFullYear()}:${this.updatedAt.getHours()}:${this.updatedAt.getMinutes()}:${this.updatedAt.getSeconds()}`;
});

BlogSchema.set('toObject', { virtuals: true });
BlogSchema.set('toJSON', { virtuals: true });

export const BlogModel: SoftDeleteModel = model<IBlog>('blog', BlogSchema);
