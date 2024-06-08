import { model, Schema, Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import MongooseDelete, { SoftDeleteModel } from 'mongoose-delete';

export enum userRoleEnum {
    USER = 'user',
    ADMIN = 'admin',
}

export enum UserRoles {
    ADMIN = 'admin',
    USER = 'user',
}

export interface IUser extends Document {
    email: string;
    password: string;
    firstName: string;
    lastName: string;// Change Object[] to Array<any> or specify a specific type
    profileImage: string;
    refreshToken: string;
    expired: Date;
    UserRoles: UserRoles;
    isActive?: boolean;
    role: userRoleEnum;
}

const IUserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            index: true,
            unique: true,
        },
        password: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        profileImage: {
            type: String,
            default:
                'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-260nw-1725655669.jpg',
        },
        refreshToken: { type: String },
        isActive: { type: Boolean, default: true },
        role: {
            type: String,
            enum: Object.values(userRoleEnum),
            default: userRoleEnum.USER,
        },
        expired: { type: Date },
        UserRoles: {
            type: String,
            enum: Object.values(UserRoles),
            default: UserRoles.USER,
        },
    },
    { collection: 'user', timestamps: true }
);

IUserSchema.plugin(MongooseDelete, { deletedAt: true, overrideMethods: true });
IUserSchema.plugin(paginate);

export const UserModel: SoftDeleteModel<IUser> = model<IUser>('user', IUserSchema);
