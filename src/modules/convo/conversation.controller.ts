import { swaggerBuilder } from '../../system/swagger';
import { PropertyFactory } from '../../system/swagger/core/property.factory';
import { createModuleFactory } from '../../system/factories/module.factory';
import { createHandler } from '../../system/factories';
import { HttpResponseBuilder } from '../../system/builders/http-response.builder';
import { identityGuard } from '../auth/auth-service/service';
import { logger } from '../../system/logging/logger';
import { ConversationModel, ICategory } from '../../system/model';
import { conversationService } from './conversation-service';
import { describe } from 'node:test';
const MODULE_NAME = 'Conversation';

export const createConversationModule = createModuleFactory({
    path: '/conversations',
    name: MODULE_NAME,
    bundler: router => {
        swaggerBuilder.addTag(MODULE_NAME);
        swaggerBuilder.addRoute({
            description: 'Get all conversations',
            route: '/conversations',
            params: [
                PropertyFactory.createParam({
                    name: 'socketId',
                    paramsIn: 'query',
                    type: 'string?',
                    description: 'Number of items per page (limit)',
                    required: false,
                }),
            ],
            tags: [MODULE_NAME],
            method: 'get',
        });
        router.get(
            '/',
            createHandler(async (req, res) => {
                const conversations =
                    await conversationService.getAllConversations(req.query);
                return HttpResponseBuilder.buildOK(res, conversations);
            }),
        );
        const createConversationDTO = 'CreateConversationDTO';
        swaggerBuilder.addModel({
            name: createConversationDTO,
            properties: {
                socketId: PropertyFactory.createProperty({
                    type: 'string',
                    description: 'Messages',
                }),
            },
        });
        swaggerBuilder.addRoute({
            description: 'create a conversation',
            route: '/conversations',
            tags: [MODULE_NAME],
            method: 'post',
            body: 'CreateConversationDTO',
        });

        router.post(
            '/',
            createHandler(async (req, res) => {
                const conversation =
                    await conversationService.createConversation(req.body);
                return HttpResponseBuilder.buildOK(res, conversation);
            }),
        );
        // get by id
        swaggerBuilder.addRoute({
            description: 'Get conversation by id',
            route: '/conversations/{id}',
            tags: [MODULE_NAME],
            method: 'get',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Order id',
                    required: true,
                }),
            ],
        });
        router.get(
            '/:id',
            createHandler(async (req, res) => {
                // const conversation =
                //     await conversationService.getConversationById(
                //         req.params.id,
                //     );
                const socketId = req.params.id;

                const conversations = await ConversationModel.findOne({
                    socketId: socketId,
                }).populate({
                    path: 'messages',
                    options: { sort: { createdAt: -1 } }, // Sắp xếp theo trường createdAt (tăng dần)
                });

                return HttpResponseBuilder.buildOK(res, conversations);
            }),
        );
        // delete
        swaggerBuilder.addRoute({
            description: 'Delete conversation by id',
            route: '/conversations/{id}',
            tags: [MODULE_NAME],
            method: 'delete',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    type: 'string',
                    required: true,
                }),
            ],
        });
        router.delete(
            '/:id',
            createHandler(async (req, res) => {
                const conversation =
                    await conversationService.deleteConversation(req.params.id);
                return HttpResponseBuilder.buildOK(res, conversation);
            }),
        );
        // create message
        const createMessageDTO = 'CreateMessageDTO';
        swaggerBuilder.addModel({
            name: createMessageDTO,
            properties: {
                senderId: PropertyFactory.createProperty({
                    type: 'string',
                    description: 'Id sender',
                }),
                message: PropertyFactory.createProperty({
                    type: 'string',
                    description: 'Message',
                }),
                isAdmin: PropertyFactory.createProperty({
                    type: 'bool',
                    description: 'Is admin',
                }),
            },
        });
        swaggerBuilder.addRoute({
            description: 'Create message',
            route: '/conversations/{id}/messages',
            tags: [MODULE_NAME],
            method: 'post',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Conversation id',
                    required: true,
                }),
            ],
            body: createMessageDTO,
        });
        router.post(
            '/:id/messages',
            createHandler(async (req, res) => {
                const conversation = await conversationService.createMessage(
                    req.params.id,
                    req.body,
                );
                return HttpResponseBuilder.buildOK(res, conversation);
            }),
        );
    },
});
