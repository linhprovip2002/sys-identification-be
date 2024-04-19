import PaginationService from '../../../system/service/pagination.service';
import {
    IUser,
    UserModel,
    ICardBreed,
    CardBreedModel,
    VariantOptionsModel,
    IVariantOptions,
} from '../../../system/model';
import { logger } from '../../../system/logging/logger';
import { stringify } from 'querystring';
import { populate } from 'dotenv';

class BreedService {
    private paginationService: PaginationService<ICardBreed>;
    constructor(CardBreedModel: any) {
        this.paginationService = new PaginationService<ICardBreed>(
            CardBreedModel,
        );
    }
    async getBreeds(productQuery: any) {
        try {
            let query: any = {};
            if (productQuery.search) {
                query.$text = { $search: productQuery.search };
            }

            let sortOptions: any = {};
            if (productQuery.sort) {
                sortOptions = productQuery.sort;
            } else {
                sortOptions = { createdAt: -1 };
            }

            const options = {
                page: productQuery.page || 1,
                limit: productQuery.limit || 10,
                sort: sortOptions,
                populate: [
                    {
                        path: 'diet',
                        select: '_id name description variantOptions',
                        populate: {
                            path: 'variantOptions',
                            select: 'name value price quantity',
                        },
                    },
                ],
            };

            // logger.info('query' + JSON.stringify(query) + 'options' + JSON.stringify(options));
            const paginatedResult = await this.paginationService.paginate(
                query,
                options,
            );

            return paginatedResult;
        } catch (error) {
            throw error;
        }
    }
    async getById(id: string) {
        try {
            const breed = await CardBreedModel.findById(id)
                .lean()
                .populate({
                    path: 'diet',
                    select: '_id name description variantOptions',
                    populate: {
                        path: 'variantOptions',
                        select: 'name value price quantity',
                    },
                });
        } catch (error) {
            throw error;
        }
    }
    async updateBreed(id: string, breed: ICardBreed) {
        try {
            const updatedBreed = await CardBreedModel.findByIdAndUpdate(
                id,
                breed,
                { new: true },
            );
            return updatedBreed;
        } catch (error) {
            throw error;
        }
    }
    async deleteBreed(id: string) {
        try {
            await CardBreedModel.findByIdAndDelete(id);
            return;
        } catch (error) {
            throw error;
        }
    }
    async createBreed(breed: ICardBreed) {
        try {
            const newBreed = await CardBreedModel.create(breed);
            return newBreed;
        } catch (error) {
            throw error;
        }
    }
}

export const createBreedService = new BreedService(CardBreedModel);
