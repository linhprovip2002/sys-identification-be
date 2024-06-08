import PaginationService from '../../../system/service/pagination.service';
import { IUser, UserModel } from '../../../system/model';
import { hashService } from '../../../modules/auth/auth-service/service';
import omit from 'lodash/omit';
import _ from 'lodash';
class UserService {
    private paginationService: PaginationService<IUser>;
    private readonly hashService = hashService;
    constructor(UserModel: any) {
        this.paginationService = new PaginationService<IUser>(UserModel);
        this.hashService = hashService;
    }

    async getUsers(userQuery: any) {
        try {
            let query: any = {};
            if (userQuery.search) {
                query.$text = { $search: userQuery.search };
            }

            let sortOptions: any = {};
            if (userQuery.sort) {
                sortOptions = userQuery.sort;
            }

            const options = {
                page: userQuery.page || 1,
                limit: userQuery.limit || 10,
                sort: sortOptions,
            };

            const paginatedResult = await this.paginationService.paginate(
                query,
                options,
            );

            const sanitizedResult = paginatedResult.docs.map(doc =>
                _.omit(doc.toObject(), 'password'),
            );

            return { ...paginatedResult, docs: sanitizedResult };
        } catch (error) {
            throw error;
        }
    }
    async getById(id: string) {
        try {
            const user = await UserModel.findById(id)
                .lean()
                .populate('addresses');

            return omit(user, 'password');
        } catch (error) {
            throw error;
        }
    }
    async updateUser(id: string, user: any) {
        try {
            let hashedPassword;
            if (user.password) {
                hashedPassword = await this.hashService.hash(user.password);
            }

            const updatedUserData = { ...user };
            if (hashedPassword) {
                updatedUserData.password = hashedPassword;
            }

            const updatedUser = await UserModel.findByIdAndUpdate(
                id,
                updatedUserData,
                {
                    new: true,
                },
            ).populate('addresses');
            return updatedUser;
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(id: string) {
        try {
            await UserModel.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }

    async changePassword({ userId, currentPass, newPass }) {
        try {
            const user = await UserModel.findById(userId);
            const checkPass = await hashService.compare({
                raw: currentPass,
                hashed: user.password,
            });
            if (checkPass === true) {
                const hashedPassword = await hashService.hash(newPass);
                user.password = hashedPassword;
                await user.save();
                return {
                    status: 200,
                    data: user,
                };
            }

            return { status: 401, message: 'Current Password is incorrect' };
        } catch (error) {
            throw error;
        }
    }
}

export const createUserService = new UserService(UserModel);
