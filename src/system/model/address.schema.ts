// Table addresses {
//   id Object [pk]
//   user_id Object [ref: > users.id]
//   street String
//   city String
//   state String
//   zipCode String
//   country String
//   createAt date
//   updateAt date
// }
// model address
import { model, Model, Schema, Document } from 'mongoose';
export interface IAddress extends Document {
    _id: Object;
    street: string;
    city: string;
    state: string;
    country: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
const IAddressSchema = new Schema<IAddress>(
    {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        isActive: { type: Boolean, default: true },
    },
    { collection: 'address', timestamps: true },
);

export const AddressModel: Model<IAddress> = model<IAddress>(
    'address',
    IAddressSchema,
);
