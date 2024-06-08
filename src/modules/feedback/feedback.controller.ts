import { swaggerBuilder } from '../../system/swagger';
import { PropertyFactory } from '../../system/swagger/core/property.factory';
import { createModuleFactory } from '../../system/factories/module.factory';
import { createHandler } from '../../system/factories';
import { HttpResponseBuilder } from '../../system/builders/http-response.builder';
import { identityGuard } from '../auth/auth-service/service';
import { FeedbackModel } from '../../system';
import { feedBackService } from './feedbacl-service';
import mongoose from 'mongoose';

const MODULE_NAME = 'Feedback';

export const createFeedBackModule = createModuleFactory({
    path: '/feedbacks',
    name: MODULE_NAME,
    bundler: router => {
        swaggerBuilder.addTag(MODULE_NAME);
        swaggerBuilder.addRoute({
            description: 'Get all feedbacks',
            route: '/feedbacks',
            tags: [MODULE_NAME],
            method: 'get',
        });
        router.get(
            '/',
            createHandler(async (req, res) => {
                const breedId = req.query.breed_id;
                if (breedId) {
                    const feedbacks = await FeedbackModel.find({
                        cardBreedsId: breedId,
                    });
                    return res.status(200).json({ data: feedbacks });
                }

                const feedbacks = await feedBackService.getAllFeedbacks();
                return HttpResponseBuilder.buildOK(res, feedbacks);
            }),
        );
        const createFeedbackDTO = 'CreateFeedbackDTO';
        swaggerBuilder.addModel({
            name: createFeedbackDTO,
            properties: {
                userId: PropertyFactory.createParam({
                    type: 'string',
                    description: 'User id',
                }),
                feedback: PropertyFactory.createParam({
                    type: 'string',
                    description: 'Feedback',
                }),
                links: PropertyFactory.createParam({
                    type: 'string',
                    description: 'Links',
                }),
                feedbackNumber: PropertyFactory.createParam({
                    type: 'Number',
                    description: 'Feedback number',
                }),
                cardBreedsId: PropertyFactory.createParam({
                    type: 'string',
                    description: 'Card breeds id',
                }),
            },
        });
        swaggerBuilder.addRoute({
            description: 'create a feedback',
            route: '/feedbacks',
            tags: [MODULE_NAME],
            method: 'post',
            body: createFeedbackDTO,
            security: true,
        });

        router.post(
            '/',
            createHandler(async (req, res) => {
                const feedback = await feedBackService.createFeedback(req.body);
                return HttpResponseBuilder.buildOK(res, feedback);
            }),
        );

        // get by id
        swaggerBuilder.addRoute({
            description: 'Get feedback by id',
            route: '/feedbacks/{id}',
            tags: [MODULE_NAME],
            method: 'get',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Feedback id',
                    required: true,
                }),
            ],
        });

        router.get(
            '/:id',
            createHandler(async (req, res) => {
                const feedback = await feedBackService.getFeedbackById(
                    req.params.id,
                );
                return HttpResponseBuilder.buildOK(res, feedback);
            }),
        );
        // delete
        swaggerBuilder.addRoute({
            description: 'Delete feedback by id',
            route: '/feedbacks/{id}',
            tags: [MODULE_NAME],
            method: 'delete',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    type: 'string',
                    required: true,
                }),
            ],
            security: true,
        });
        router.delete(
            '/:id',
            identityGuard,
            createHandler(async (req, res) => {
                await feedBackService.deleteFeedback(req.params.id);
                return HttpResponseBuilder.buildOK(res, {
                    message: 'Delete feedback successfully',
                });
            }),
        );

        router.delete(
            '/',
            identityGuard,
            createHandler(async (req, res) => {
                const ids = req.body.ids;

                if (!Array.isArray(ids))
                    return res
                        .status(422)
                        .json({ message: 'ids must be array' });
                if (ids.length === 0)
                    return res
                        .status(422)
                        .json({ message: 'ids cannot be a empty array' });

                try {
                    const result = await FeedbackModel.deleteMany({
                        _id: { $in: ids },
                    });
                    return res
                        .status(200)
                        .json({ status: 'Success', data: result });
                } catch (error) {
                    return res.status(500).json({ message: error.message });
                }
            }),
        );
    },
});
