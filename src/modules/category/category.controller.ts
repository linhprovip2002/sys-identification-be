import { swaggerBuilder } from '../../system/swagger';
import { PropertyFactory } from '../../system/swagger/core/property.factory';
import { createModuleFactory } from '../../system/factories/module.factory';
import { createHandler } from '../../system/factories';
import { HttpResponseBuilder } from '../../system/builders/http-response.builder';
import { identityGuard } from '../auth/auth-service/service';
import { logger } from '../../system/logging/logger';
import { categoryService } from './category-service';
import { ICategory } from '../../system/model';
const MODULE_NAME = 'Category';

export const createCategoryModule = createModuleFactory({
    path: '/categories',
    name: MODULE_NAME,
    bundler: router => {
        swaggerBuilder.addTag(MODULE_NAME);

        swaggerBuilder.addRoute({
            description: 'Get all categories',
            route: '/categories',
            tags: [MODULE_NAME],
            method: 'get',
        });
        router.get(
            '/',
            createHandler(async (req, res) => {
                const categories = await categoryService.getAllCategories();
                return HttpResponseBuilder.buildOK(res, categories);
            }),
        );
        // create category
        const CATEGORY_DTO_NAME = 'CategoryDto';
        swaggerBuilder.addModel({
            name: CATEGORY_DTO_NAME,
            properties: {
                name: PropertyFactory.createProperty({ type: 'string' }),
                description: PropertyFactory.createProperty({ type: 'string' }),
            },
        });
        swaggerBuilder.addRoute({
            description: 'Create category',
            route: '/categories',
            tags: [MODULE_NAME],
            body: CATEGORY_DTO_NAME,
            method: 'post',
        });
        router.post(
            '/',
            createHandler(async (req, res) => {
                const createCategoryDTO = {
                    name: req.body.name,
                    description: req.body.description,
                };
                const category: ICategory =
                    await categoryService.createCategory(createCategoryDTO);
                return HttpResponseBuilder.buildCreated(res, category);
            }),
        );
        //get products by Id
        swaggerBuilder.addRoute({
            description: 'Get products by category',
            route: '/categories/{id}',
            tags: [MODULE_NAME],
            method: 'get',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Category id',
                    required: true,
                }),
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
            ],
        });
        router.get(
            '/:id',
            createHandler(async (req, res) => {
                const category = await categoryService.getCategoryById(
                    req.params.id,
                    req.query.page,
                    req.query.limit,
                );
                return HttpResponseBuilder.buildOK(res, category);
            }),
        );
    },
});
