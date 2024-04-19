import { swaggerBuilder } from '../../system/swagger';
import { PropertyFactory } from '../../system/swagger/core/property.factory';
import { createModuleFactory } from '../../system/factories/module.factory';
import { createHandler } from '../../system/factories';
import { HttpResponseBuilder } from '../../system/builders/http-response.builder';
import { identityGuard } from '../auth/auth-service/service';
import { logger } from '../../system/logging/logger';
import { VariantOptionsModel } from '../../system/model';

import { model } from 'mongoose';
const MODULE_NAME = 'Variant Option';

export const createVariantModule = createModuleFactory({
    path: '/variant-options',
    name: MODULE_NAME,
    bundler: router => {
        swaggerBuilder.addTag(MODULE_NAME);

        // swaggerBuilder.addRoute({
        //     description: "Get all variant options",
        //     route: '/variant-options',
        //     tags: [MODULE_NAME],
        //     method: 'get',
        //     params: [
        //         PropertyFactory.createParam({
        //             name: 'limit',
        //             paramsIn: 'query',
        //             type: 'number?',
        //             description: 'Number of items per page (limit)',
        //             required: false,
        //         }),
        //         PropertyFactory.createParam({
        //             name: 'page',
        //             paramsIn: 'query',
        //             type: 'number?',
        //             description: 'Page number',
        //             required: false,
        //         }),
        //         PropertyFactory.createParam({
        //             name: 'search',
        //             paramsIn: 'query',
        //             type: 'string?',
        //             description: 'Search query',
        //             required: false,
        //         }),
        //         PropertyFactory.createParam({
        //             name: 'sort',
        //             paramsIn: 'query',
        //             type: 'string?',
        //             description: 'Sort query',
        //             required: false,
        //         }),
        //     ],
        //     // security: true,
        // })

        // edit variant options
        swaggerBuilder.addRoute({
            description: 'Edit variant options',
            route: '/variant-options/{id}',
            method: 'put',
            body: 'UpdateVariantOptions',
            tags: [MODULE_NAME],
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Variant option ID',
                    required: true,
                }),
            ],
        });
        router.put(
            '/:id',
            createHandler(async (req, res) => {
                const { id } = req.params;
                const variantOptions =
                    await VariantOptionsModel.findByIdAndUpdate(
                        id,
                        req.body.variantOptions[0],
                        { new: true },
                    );
                if (!variantOptions) {
                    return HttpResponseBuilder.buildBadRequest(
                        res,
                        'Variant option not found',
                    );
                }
                return HttpResponseBuilder.buildOK(res, variantOptions);
            }),
        );

        // delete variant options
        swaggerBuilder.addRoute({
            description: 'Delete variant options',
            route: '/variant-options/{id}',
            method: 'delete',
            tags: [MODULE_NAME],
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Variant option ID',
                    required: true,
                }),
            ],
        });
        router.delete(
            '/:id',
            createHandler(async (req, res) => {
                const { id } = req.params;
                const variantOptions =
                    await VariantOptionsModel.findByIdAndDelete(id);
                if (!variantOptions) {
                    return HttpResponseBuilder.buildBadRequest(
                        res,
                        'Variant option not found',
                    );
                }
                return HttpResponseBuilder.buildOK(res, variantOptions);
            }),
        );
    },
});
