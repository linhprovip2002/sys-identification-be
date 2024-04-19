import { model, Model, Schema, Document } from 'mongoose';

export interface IConversation extends Document {
    _id: Object;
    users: Object;
    adminId: Object;
    messages: IMessage[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IMessage extends Document {
    _id: Object;
    senderId: Object;
    message: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export const MessageSchema = new Schema<IMessage>(
    {
        senderId: { type: Schema.Types.ObjectId, ref: 'user' },
        message: { type: String, required: true },
    },
    { collection: 'message', timestamps: true },
);
export const ConversationSchema = new Schema<IConversation>(
    {
        users: { type: Schema.Types.ObjectId, ref: 'user' },
        adminId: { type: Schema.Types.ObjectId, ref: 'user' },
        messages: [
            {
                type: Schema.Types.ObjectId,
                ref: 'message',
            },
        ],
    },
    { collection: 'conversation', timestamps: true },
);

export const MessageModel: Model<IMessage> = model<IMessage>(
    'message',
    MessageSchema,
);
export const ConversationModel: Model<IConversation> = model<IConversation>(
    'conversation',
    ConversationSchema,
);
