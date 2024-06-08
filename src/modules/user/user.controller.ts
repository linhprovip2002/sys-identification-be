import { swaggerBuilder } from '../../system/swagger';
import { PropertyFactory } from '../../system/swagger/core/property.factory';
import { createModuleFactory } from '../../system/factories/module.factory';
import { createHandler } from '../../system/factories';
import { HttpResponseBuilder } from '../../system/builders/http-response.builder';
import { createUserService } from './user-service/user.service';
import { identityGuard } from '../auth/auth-service/service';
import { logger } from '../../system/logging/logger';
const MODULE_NAME = 'User';
export const createUserModule = createModuleFactory({
    path: '/users',
    name: MODULE_NAME,
    bundler: router => {
        swaggerBuilder.addTag(MODULE_NAME);

        swaggerBuilder.addRoute({
            description: 'Get all users',
            route: '/users',
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
            security: true,
        });
        router.get(
            '/',
            identityGuard,
            createHandler(async (req, res) => {
                const users = await createUserService.getUsers(req.query);
                return HttpResponseBuilder.buildOK(res, users);
            }),
        );
        swaggerBuilder.addRoute({
            description: 'Get user by id',
            route: '/users/{id}',
            tags: [MODULE_NAME],
            method: 'get',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Object id of user',
                    required: true,
                }),
            ],
            security: true,
        });
        router.get(
            '/:id',
            identityGuard,
            createHandler(async (req, res) => {
                // logger.info(req.params.id);
                const user = await createUserService.getById(req.params.id);
                return HttpResponseBuilder.buildOK(res, user);
            }),
        );

        const USER_UPDATE_DTO = 'UserUpdateDto';
        swaggerBuilder.addModel({
            name: 'UserUpdateDto',
            properties: {
                firstName: PropertyFactory.createProperty({
                    type: 'string',
                    required: false,
                }),
                lastName: PropertyFactory.createProperty({
                    type: 'string',
                    required: false,
                }),
                email: PropertyFactory.createProperty({
                    type: 'string',
                    required: false,
                }),
                password: PropertyFactory.createProperty({
                    type: 'string',
                    required: false,
                }),
                profileImage: PropertyFactory.createProperty({
                    type: 'string',
                    required: false,
                }),
            },
        });

        swaggerBuilder.addRoute({
            description: 'Update user by id',
            route: '/users/{id}',
            tags: [MODULE_NAME],
            method: 'patch',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Object id of user',
                    required: true,
                }),
            ],
            body: USER_UPDATE_DTO,
            security: true,
        });
        router.patch(
            '/:id',
            identityGuard,
            createHandler(async (req, res) => {
                logger.info(req.params.id);
                const user = await createUserService.updateUser(
                    req.params.id,
                    req.body,
                );
                return HttpResponseBuilder.buildOK(res, user);
            }),
        );
        swaggerBuilder.addRoute({
            description: 'Delete user by id',
            route: '/users/{id}',
            tags: [MODULE_NAME],
            method: 'delete',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Object id of user',
                    required: true,
                }),
            ],
            security: true,
        });
        router.delete(
            '/:id',
            identityGuard,
            createHandler(async (req, res) => {
                await createUserService.deleteUser(req.params.id);
                return HttpResponseBuilder.buildNoContent(res);
            }),
        );

        router.put(
            '/changepass',
            identityGuard,
            createHandler(async (req, response) => {
                const userId = req.user.userId;
                const currentPass = req.body.currentPass;
                const newPass = req.body.newPass;
                const data = await createUserService.changePassword({
                    userId,
                    currentPass,
                    newPass,
                });

                return response.json(data);
            }),
        );
    },
});
