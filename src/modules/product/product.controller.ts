import { swaggerBuilder } from '../../system/swagger';
import { PropertyFactory } from '../../system/swagger/core/property.factory';
import { createModuleFactory } from '../../system/factories/module.factory';
import { createHandler } from '../../system/factories';
import { HttpResponseBuilder } from '../../system/builders/http-response.builder';
import { identityGuard } from '../auth/auth-service/service';
import { logger } from '../../system/logging/logger';
import {
    productCreateDtoValidator,
    createProductsService,
    productUpdateDtoValidator,
} from './product-service/';
import {} from '../../system/model';
import { model } from 'mongoose';
const MODULE_NAME = 'Product';

export const createProductModule = createModuleFactory({
    path: '/products',
    name: MODULE_NAME,
    bundler: router => {
        swaggerBuilder.addTag(MODULE_NAME);

        swaggerBuilder.addRoute({
            description: 'Get all products',
            route: '/products',
            tags: [MODULE_NAME],
            method: 'get',
            params: [
                PropertyFactory.createParam({
                    name: 'limit',
                    paramsIn: 'query',
                    type: 'number?',
                    description: 'Number of items per page (limit)',
                    required: false,
                }),
                PropertyFactory.createParam({
                    name: 'page',
                    paramsIn: 'query',
                    type: 'number?',
                    description: 'Page number',
                    required: false,
                }),
                PropertyFactory.createParam({
                    name: 'search',
                    paramsIn: 'query',
                    type: 'string?',
                    description: 'Search query',
                    required: false,
                }),
                PropertyFactory.createParam({
                    name: 'sort',
                    paramsIn: 'query',
                    type: 'string?',
                    description: 'Sort query',
                    required: false,
                }),
            ],
            // security: true,
        });
        router.get(
            '/',
            createHandler(async (req, res) => {
                const categories = await createProductsService.getProducts(
                    req.query,
                );
                return HttpResponseBuilder.buildOK(res, categories);
            }),
        );

        // create product

        const productCreateDto = 'ProductCreateDto';

        swaggerBuilder.addModel({
            name: 'VariantOptions',
            properties: {
                name: PropertyFactory.createProperty({
                    type: 'string',
                    description: 'Variant option name',
                }),
                value: PropertyFactory.createProperty({
                    type: 'string',
                    description: 'Variant option value',
                }),
                price: PropertyFactory.createProperty({
                    type: 'Number',
                    description: 'Variant option price',
                }),
                quantity: PropertyFactory.createProperty({
                    type: 'Number',
                    description: 'Variant option quantity',
                }),
            },
        });

        swaggerBuilder.addModel({
            name: 'ProductCreateDto',
            properties: {
                name: PropertyFactory.createProperty({
                    type: 'string',
                    description: 'Product name',
                }),
                description: PropertyFactory.createProperty({
                    type: 'string',
                    description: 'Product description',
                }),
                categoryID: PropertyFactory.createProperty({
                    type: 'string',
                    description: 'Category id',
                }),
                htmlDomDescription: PropertyFactory.createProperty({
                    type: 'string',
                    description: 'HTML description',
                }),
                variantOptions: PropertyFactory.createProperty({
                    type: 'array',
                    model: 'VariantOptions',
                    description: 'Variant options',
                }),
                productImage: PropertyFactory.createProperty({
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Product image',
                }),
            },
        });

        swaggerBuilder.addRoute({
            description: 'Create product',
            route: '/products',
            tags: [MODULE_NAME],
            method: 'post',
            body: productCreateDto,
        });
        router.post(
            '/',
            productCreateDtoValidator,
            createHandler(async (req, res) => {
                const product = await createProductsService.createProduct(
                    req.body,
                );
                return HttpResponseBuilder.buildOK(res, product);
            }),
        );

        swaggerBuilder.addRoute({
            description: 'Get product by id',
            route: '/products/{id}',
            tags: [MODULE_NAME],
            method: 'get',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Product id',
                    required: true,
                }),
            ],
        });
        router.get(
            '/:id',
            createHandler(async (req, res) => {
                // logger.info('Get product by id');
                // logger.info(req.params.id);
                const product = await createProductsService.getById(
                    req.params.id,
                );
                return HttpResponseBuilder.buildOK(res, product);
            }),
        );
        const updatedProduct = 'UpdateProduct';
        swaggerBuilder.addModel({
            name: 'UpdateProduct',
            properties: {
                name: PropertyFactory.createProperty({
                    type: 'string',
                    description: 'Product name',
                }),
                description: PropertyFactory.createProperty({
                    type: 'string',
                    description: 'Product description',
                }),
                categoryID: PropertyFactory.createProperty({
                    type: 'string',
                    description: 'Category id',
                }),
                htmlDomDescription: PropertyFactory.createProperty({
                    type: 'string',
                    description: 'HTML description',
                }),
                productImage: PropertyFactory.createProperty({
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Product image',
                }),
            },
        });
        swaggerBuilder.addRoute({
            description: 'Update product by id',
            route: '/products/{id}',
            tags: [MODULE_NAME],
            method: 'patch',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Product id',
                    required: true,
                }),
            ],
            body: updatedProduct,
        });
        router.patch(
            '/:id',
            productUpdateDtoValidator,
            createHandler(async (req, res) => {
                const product = await createProductsService.updateProduct(
                    req.params.id,
                    req.body,
                );
                return HttpResponseBuilder.buildOK(res, product);
            }),
        );
        swaggerBuilder.addRoute({
            description: 'Delete product by id',
            route: '/products/:id',
            tags: [MODULE_NAME],
            method: 'delete',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Product id',
                    required: true,
                }),
            ],
        });
        router.delete(
            '/:id',
            createHandler(async (req, res) => {
                await createProductsService.deleteProduct(req.params.id);
                return HttpResponseBuilder.buildOK(res, {});
            }),
        );
        // update variant options
        const updateVariantOptions = 'UpdateVariantOptions';
        swaggerBuilder.addModel({
            name: 'UpdateVariantOptions',
            properties: {
                name: PropertyFactory.createProperty({
                    type: 'string',
                    description: 'Variant option name',
                }),
                value: PropertyFactory.createProperty({
                    type: 'string',
                    description: 'Variant option value',
                }),
                price: PropertyFactory.createProperty({
                    type: 'Number',
                    description: 'Variant option price',
                }),
                quantity: PropertyFactory.createProperty({
                    type: 'Number',
                    description: 'Variant option quantity',
                }),
            },
            isArray: true,
        });
        swaggerBuilder.addRoute({
            description: 'Update variant options by id',
            route: '/products/{id}/variant-options',
            tags: [MODULE_NAME],
            method: 'post',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Product id',
                    required: true,
                }),
            ],
            body: updateVariantOptions,
        });
        router.post(
            '/:id/variant-options',
            createHandler(async (req, res) => {
                const product =
                    await createProductsService.updateVariantOptions(
                        req.params.id,
                        req.body,
                    );
                return HttpResponseBuilder.buildOK(res, product);
            }),
        );
    },
});
