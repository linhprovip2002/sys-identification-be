import { model, Model, Schema, Document } from 'mongoose';

export interface IConversation extends Document {
    _id: Object;
    users: Object;
    adminId: Object;
    messages: IMessage[];
    lastMessage: String;
    socketId?: string; // Thêm trường socketId
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IMessage extends Document {
    _id: Object;
    senderId: Object;
    message: String;
    isAdmin: Boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export const MessageSchema = new Schema<IMessage>(
    {
        senderId: { type: String},
        isAdmin: { type: Boolean, required: true},
        message: { type: String, required: true },
    },
    { collection: 'message', timestamps: true },
);

export const ConversationSchema = new Schema<IConversation>(
    {
        adminId: { type: Schema.Types.ObjectId, ref: 'user'},
        messages: [
            {
                type: Schema.Types.ObjectId,
                ref: 'message',
            },
        ],
        lastMessage: { type: String },
        socketId: { type: String } // Thêm trường socketId vào schema
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

// Hàm kiểm tra và trả về conversation dựa trên socketId
export async function getConversationBySocketId(socketId: string): Promise<IConversation | null> {
    return await ConversationModel.findOne({ socketId: socketId }).populate({
        path: 'messages',
        options: { sort: { createdAt: -1 } }, // Sắp xếp theo trường createdAt (tăng dần)
    });
}

// Hàm tạo mới conversation hoặc tìm conversation đã tồn tại dựa trên socketId
export async function findOrCreateConversation(socketId: string): Promise<IConversation> {
    let conversation = await getConversationBySocketId(socketId);
    if (!conversation) {
        // Nếu không tìm thấy conversation, tạo mới một conversation với socketId được cung cấp
        conversation = await ConversationModel.create({ socketId: socketId });
    }
    return conversation;
}
