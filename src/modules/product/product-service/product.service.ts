import PaginationService from '../../../system/service/pagination.service';
import {
    IUser,
    UserModel,
    IProduct,
    ProductModel,
    VariantOptionsModel,
    IVariantOptions,
} from '../../../system/model';
import { logger } from '../../../system/logging/logger';
import { stringify } from 'querystring';
class ProductService {
    private paginationService: PaginationService<IProduct>;

    constructor(ProductModel: any) {
        this.paginationService = new PaginationService<IProduct>(ProductModel);
    }

    async getProducts(productQuery: any) {
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
                        path: 'variantOptions',
                        select: 'name value price quantity',
                    },
                    { path: 'categoryID', select: 'name' },
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
            const product = await ProductModel.findById(id)
                .lean()
                .populate({
                    path: 'variantOptions',
                    select: 'name value price quantity',
                });

            return product;
        } catch (error) {
            throw error;
        }
    }
    async updateProduct(id: string, product: any) {
        try {
            const updatedProduct = await ProductModel.findByIdAndUpdate(
                id,
                product,
                { new: true },
            );
            return updatedProduct;
        } catch (error) {
            throw error;
        }
    }
    async deleteProduct(id: string) {
        try {
            await ProductModel.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
    async createProduct(product: any) {
        try {
            const { variantOptions, ...productData } = product;
            const variantOptionPromises = variantOptions.map(
                variantOptionData =>
                    VariantOptionsModel.create(variantOptionData),
            );

            const createdVariantOptions = await Promise.all(
                variantOptionPromises,
            );

            const variantOptionsIds = createdVariantOptions.map(
                variantOption => variantOption._id,
            );

            const newProductData = {
                ...productData,
                variantOptions: variantOptionsIds,
            };
            const newProduct = await ProductModel.create(newProductData);

            return this.getById(newProduct._id);
        } catch (error) {
            throw error;
        }
    }
    async getProductsByCategory(categoryId: string, page?, limit?) {
        try {
            // pagination
            const query = { categoryID: categoryId };
            const options = {
                page: page || 1,
                limit: limit || 10,
                populate: [
                    {
                        path: 'variantOptions',
                        select: 'name value price quantity',
                    },
                    { path: 'categoryID', select: 'name' },
                ],
            };
            const products = await this.paginationService.paginate(
                query,
                options,
            );
            return products;
        } catch (error) {
            throw error;
        }
    }
    async updateVariantOptions(
        productId: string,
        variantOptions: IVariantOptions[],
    ) {
        try {
            const variantOptionPromises = variantOptions.map(
                variantOptionData =>
                    VariantOptionsModel.create(variantOptionData),
            );

            const createdVariantOptions = await Promise.all(
                variantOptionPromises,
            );

            const variantOptionsIds = createdVariantOptions.map(
                variantOption => variantOption._id,
            );

            await ProductModel.findByIdAndUpdate(productId, {
                variantOptions: variantOptionsIds,
            });

            return this.getById(productId);
        } catch (error) {
            throw error;
        }
    }
}

export const createProductsService = new ProductService(ProductModel);
