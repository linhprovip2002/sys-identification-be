import { model, Model, Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
    _id: Object;
    userId: Object;
    feedback: string;
    feedbackNumber: number;
    cardBreedsId: Object;
    createdAt?: Date;
    updatedAt?: Date;
}
// link image
export const FeedbackSchema = new Schema<IFeedback>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'user' },
        feedback: { type: String, required: true },
        feedbackNumber: { type: Number, required: true },
        cardBreedsId: { type: Schema.Types.ObjectId, ref: 'cardBreeds' },
    },
    { collection: 'feedback', timestamps: true },
);
export const FeedbackModel: Model<IFeedback> = model<IFeedback>(
    'feedback',
    FeedbackSchema,
);
