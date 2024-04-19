import { UserModel, IUser } from 'system/model';
import { connectDatabase } from '../database.connector';
import {
    hashService,
    userIdentityService,
} from '../../../modules/auth/auth-service/service';
async () => {
    await connectDatabase();
};

function seedUser() {}
