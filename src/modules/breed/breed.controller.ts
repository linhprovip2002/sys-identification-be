import { swaggerBuilder } from '../../system/swagger';
import { PropertyFactory } from '../../system/swagger/core/property.factory';
import { createModuleFactory } from '../../system/factories/module.factory';
import { createHandler } from '../../system/factories';
import { HttpResponseBuilder } from '../../system/builders/http-response.builder';
import { identityGuard } from '../auth/auth-service/service';
import { logger } from '../../system/logging/logger';
import {
    createBreedService,
    breedCreateValidator,
    breedUpdateValidator,
} from './breed-service';

const MODULE_NAME = 'Breed';

export const createBreedModule = createModuleFactory({
    path: '/breeds',
    name: MODULE_NAME,
    bundler: router => {
        swaggerBuilder.addTag(MODULE_NAME);

        // create breed card

        swaggerBuilder.addModel({
            name: 'BreedCreateDTO',
            properties: {
                breed_name: PropertyFactory.createProperty({
                    type: 'string',
                    description: 'Name of the breed',
                }),
                appearance: PropertyFactory.createProperty({
                    type: 'string',
                    description: 'Appearance of the breed',
                }),
                behavior: PropertyFactory.createProperty({
                    type: 'string',
                    description: 'Behavior of the breed',
                }),
                common_health_issues: PropertyFactory.createProperty({
                    type: 'string',
                    description: 'Common health issues of the breed',
                }),
                diet: PropertyFactory.createProperty({
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Array of product IDs for the breed diet',
                }),
                breedImages: PropertyFactory.createProperty({
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Array of image URLs for the breed',
                }),
                description: PropertyFactory.createProperty({
                    type: 'string',
                    description: 'Description of the breed',
                }),
            },
        });

        swaggerBuilder.addRoute({
            description: 'Create breed',
            route: '/breeds',
            tags: [MODULE_NAME],
            method: 'post',
            body: 'BreedCreateDTO',
        });
        router.post(
            '/',
            // identityGuard,
            // breedCreateValidator,
            createHandler(async (req, res) => {
                logger.info('Create breed: ' + JSON.stringify(req.body));
                const breed = await createBreedService.createBreed(req.body);
                return HttpResponseBuilder.buildOK(res, breed);
            }),
        );

        swaggerBuilder.addRoute({
            description: 'Get all breeds',
            route: '/breeds',
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
        });
        router.get(
            '/',
            createHandler(async (req, res) => {
                const breeds = await createBreedService.getBreeds(req.query);
                return HttpResponseBuilder.buildOK(res, breeds);
            }),
        );

        swaggerBuilder.addRoute({
            description: 'Get breed by id',
            route: '/breeds/{id}',
            tags: [MODULE_NAME],
            method: 'get',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Breed id',
                    required: true,
                }),
            ],
        });
        router.get(
            '/:id',
            createHandler(async (req, res) => {
                const breed = await createBreedService.getById(req.params.id);
                return HttpResponseBuilder.buildOK(res, breed);
            }),
        );

        // update use patch
        const updateBreedDTO = 'BreedUpdateDTO';
        swaggerBuilder.addModel({
            name: 'BreedUpdateDTO',
            properties: {
                breed_name: PropertyFactory.createProperty({
                    type: 'string',
                    description: 'name',
                }),
                appearance: PropertyFactory.createProperty({
                    type: 'string',
                    description: 'appearance ',
                }),
                behavior: PropertyFactory.createProperty({
                    type: 'string',
                    description: 'behavior',
                }),
                common_health_issues: PropertyFactory.createProperty({
                    type: 'string',
                    description: 'Common healthy issue',
                }),
                diet: PropertyFactory.createProperty({
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Product',
                }),
                breedImages: PropertyFactory.createProperty({
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Product image',
                }),
                description: PropertyFactory.createProperty({
                    type: 'string',
                    description: 'Product image',
                }),
            },
        });
        swaggerBuilder.addRoute({
            description: 'Update breed by id',
            route: '/breeds/{id}',
            tags: [MODULE_NAME],
            method: 'patch',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Breed id',
                    required: true,
                }),
            ],
            body: updateBreedDTO,
        });

        router.patch(
            '/:id',
            identityGuard,
            breedUpdateValidator,
            createHandler(async (req, res) => {
                const breed = await createBreedService.updateBreed(
                    req.params.id,
                    req.body,
                );
                return HttpResponseBuilder.buildOK(res, breed);
            }),
        );
        // delete breed
        swaggerBuilder.addRoute({
            description: 'Delete breed by id',
            route: '/breeds/{id}',
            tags: [MODULE_NAME],
            method: 'delete',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Breed id',
                    required: true,
                }),
            ],
        });
        router.delete(
            '/:id',
            identityGuard,
            createHandler(async (req, res) => {
                await createBreedService.deleteBreed(req.params.id);
                return HttpResponseBuilder.buildOK(res, {});
            }),
        );
    },
});
